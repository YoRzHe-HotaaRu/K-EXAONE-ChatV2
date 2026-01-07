import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Conversation, Message, ChatState, ChatActions } from '@/types/chat';
import { generateId, generateConversationTitle } from '@/lib/utils';

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            // State
            conversations: [],
            activeConversationId: null,
            isStreaming: false,
            error: null,

            // Create a new conversation
            createConversation: () => {
                const id = generateId();
                const newConversation: Conversation = {
                    id,
                    title: 'New Conversation',
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    conversations: [newConversation, ...state.conversations],
                    activeConversationId: id,
                }));

                return id;
            },

            // Delete a conversation
            deleteConversation: (id: string) => {
                set((state) => {
                    const newConversations = state.conversations.filter((c) => c.id !== id);
                    const newActiveId =
                        state.activeConversationId === id
                            ? newConversations[0]?.id || null
                            : state.activeConversationId;

                    return {
                        conversations: newConversations,
                        activeConversationId: newActiveId,
                    };
                });
            },

            // Set active conversation
            setActiveConversation: (id: string) => {
                set({ activeConversationId: id });
            },

            // Add a message to a conversation
            addMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
                const messageId = generateId();
                const newMessage: Message = {
                    ...message,
                    id: messageId,
                    createdAt: new Date(),
                };

                set((state) => ({
                    conversations: state.conversations.map((conv) => {
                        if (conv.id !== conversationId) return conv;

                        // Update title if this is the first user message
                        const isFirstUserMessage =
                            message.role === 'user' &&
                            !conv.messages.some((m) => m.role === 'user');

                        return {
                            ...conv,
                            title: isFirstUserMessage
                                ? generateConversationTitle(message.content)
                                : conv.title,
                            messages: [...conv.messages, newMessage],
                            updatedAt: new Date(),
                        };
                    }),
                }));

                return messageId;
            },

            // Update a message
            updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) => {
                        if (conv.id !== conversationId) return conv;

                        return {
                            ...conv,
                            messages: conv.messages.map((msg) =>
                                msg.id === messageId ? { ...msg, ...updates } : msg
                            ),
                            updatedAt: new Date(),
                        };
                    }),
                }));
            },

            // Set streaming state
            setStreaming: (isStreaming: boolean) => {
                set({ isStreaming });
            },

            // Set error
            setError: (error: string | null) => {
                set({ error });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Load from storage (handled by persist middleware)
            loadFromStorage: () => {
                // Hydration is automatic with persist middleware
            },

            // Save to storage (handled by persist middleware)
            saveToStorage: () => {
                // Persistence is automatic with persist middleware
            },
        }),
        {
            name: 'k-exaone-chat-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                conversations: state.conversations,
                activeConversationId: state.activeConversationId,
            }),
            // Convert date strings back to Date objects on hydration
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.conversations = state.conversations.map((conv) => ({
                        ...conv,
                        createdAt: new Date(conv.createdAt),
                        updatedAt: new Date(conv.updatedAt),
                        messages: conv.messages.map((msg) => ({
                            ...msg,
                            createdAt: new Date(msg.createdAt),
                        })),
                    }));
                }
            },
        }
    )
);

// Selector hooks for better performance
export const useActiveConversation = () =>
    useChatStore((state) => {
        const { conversations, activeConversationId } = state;
        return conversations.find((c) => c.id === activeConversationId) || null;
    });

export const useConversations = () =>
    useChatStore((state) => state.conversations);

export const useIsStreaming = () =>
    useChatStore((state) => state.isStreaming);

export const useChatError = () =>
    useChatStore((state) => state.error);
