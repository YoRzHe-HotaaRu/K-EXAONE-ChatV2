import { useChatStore } from '@/stores/chatStore';
import { act } from '@testing-library/react';

// Reset store before each test
beforeEach(() => {
    useChatStore.setState({
        conversations: [],
        activeConversationId: null,
        isStreaming: false,
        error: null,
    });
    localStorage.clear();
});

describe('chatStore', () => {
    describe('createConversation', () => {
        it('creates a new conversation', () => {
            act(() => {
                useChatStore.getState().createConversation();
            });

            const state = useChatStore.getState();
            expect(state.conversations).toHaveLength(1);
            expect(state.conversations[0].title).toBe('New Conversation');
            expect(state.conversations[0].messages).toEqual([]);
        });

        it('sets the new conversation as active', () => {
            let conversationId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            expect(useChatStore.getState().activeConversationId).toBe(conversationId!);
        });

        it('adds new conversations to the beginning of the list', () => {
            act(() => {
                useChatStore.getState().createConversation();
                useChatStore.getState().createConversation();
            });

            const state = useChatStore.getState();
            expect(state.conversations).toHaveLength(2);
            expect(state.activeConversationId).toBe(state.conversations[0].id);
        });
    });

    describe('deleteConversation', () => {
        it('removes a conversation', () => {
            let conversationId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().deleteConversation(conversationId!);
            });

            expect(useChatStore.getState().conversations).toHaveLength(0);
        });

        it('clears activeConversationId if active conversation is deleted', () => {
            let conversationId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().deleteConversation(conversationId!);
            });

            expect(useChatStore.getState().activeConversationId).toBeNull();
        });

        it('switches to next conversation if active is deleted', () => {
            let id1: string;
            let id2: string;

            act(() => {
                id1 = useChatStore.getState().createConversation();
                id2 = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().deleteConversation(id2!);
            });

            expect(useChatStore.getState().activeConversationId).toBe(id1!);
        });
    });

    describe('setActiveConversation', () => {
        it('sets the active conversation', () => {
            let id1: string;
            let id2: string;

            act(() => {
                id1 = useChatStore.getState().createConversation();
                id2 = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().setActiveConversation(id1!);
            });

            expect(useChatStore.getState().activeConversationId).toBe(id1!);
        });
    });

    describe('addMessage', () => {
        it('adds a message to a conversation', () => {
            let conversationId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().addMessage(conversationId!, {
                    role: 'user',
                    content: 'Hello!',
                });
            });

            const conversation = useChatStore.getState().conversations[0];
            expect(conversation.messages).toHaveLength(1);
            expect(conversation.messages[0].content).toBe('Hello!');
            expect(conversation.messages[0].role).toBe('user');
        });

        it('updates conversation title on first user message', () => {
            let conversationId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().addMessage(conversationId!, {
                    role: 'user',
                    content: 'Tell me a joke about programming',
                });
            });

            const conversation = useChatStore.getState().conversations[0];
            expect(conversation.title).toBe('Tell me a joke about programming');
        });

        it('does not update title on subsequent messages', () => {
            let conversationId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            act(() => {
                useChatStore.getState().addMessage(conversationId!, {
                    role: 'user',
                    content: 'First message',
                });
            });

            const originalTitle = useChatStore.getState().conversations[0].title;

            act(() => {
                useChatStore.getState().addMessage(conversationId!, {
                    role: 'user',
                    content: 'Second message',
                });
            });

            expect(useChatStore.getState().conversations[0].title).toBe(originalTitle);
        });

        it('returns the message ID', () => {
            let conversationId: string;
            let messageId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
            });

            act(() => {
                messageId = useChatStore.getState().addMessage(conversationId!, {
                    role: 'user',
                    content: 'Test',
                });
            });

            expect(messageId!).toBeDefined();
            expect(typeof messageId!).toBe('string');
        });
    });

    describe('updateMessage', () => {
        it('updates message content', () => {
            let conversationId: string;
            let messageId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
                messageId = useChatStore.getState().addMessage(conversationId, {
                    role: 'assistant',
                    content: 'Initial',
                });
            });

            act(() => {
                useChatStore.getState().updateMessage(conversationId!, messageId!, {
                    content: 'Updated content',
                });
            });

            const message = useChatStore.getState().conversations[0].messages[0];
            expect(message.content).toBe('Updated content');
        });

        it('adds reasoning_content to message', () => {
            let conversationId: string;
            let messageId: string;

            act(() => {
                conversationId = useChatStore.getState().createConversation();
                messageId = useChatStore.getState().addMessage(conversationId, {
                    role: 'assistant',
                    content: '',
                });
            });

            act(() => {
                useChatStore.getState().updateMessage(conversationId!, messageId!, {
                    reasoning_content: 'My thought process...',
                });
            });

            const message = useChatStore.getState().conversations[0].messages[0];
            expect(message.reasoning_content).toBe('My thought process...');
        });
    });

    describe('streaming state', () => {
        it('sets streaming state', () => {
            act(() => {
                useChatStore.getState().setStreaming(true);
            });

            expect(useChatStore.getState().isStreaming).toBe(true);

            act(() => {
                useChatStore.getState().setStreaming(false);
            });

            expect(useChatStore.getState().isStreaming).toBe(false);
        });
    });

    describe('error handling', () => {
        it('sets error message', () => {
            act(() => {
                useChatStore.getState().setError('Something went wrong');
            });

            expect(useChatStore.getState().error).toBe('Something went wrong');
        });

        it('clears error', () => {
            act(() => {
                useChatStore.getState().setError('Error');
                useChatStore.getState().clearError();
            });

            expect(useChatStore.getState().error).toBeNull();
        });
    });
});
