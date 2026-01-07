'use client';

import { useCallback, useRef } from 'react';
import { useChatStore, useActiveConversation, useIsStreaming } from '@/stores/chatStore';

interface UseChatOptions {
    onError?: (error: Error) => void;
}

export function useChat(options: UseChatOptions = {}) {
    const { onError } = options;
    const abortControllerRef = useRef<AbortController | null>(null);

    const activeConversation = useActiveConversation();
    const isStreaming = useIsStreaming();

    const {
        createConversation,
        addMessage,
        updateMessage,
        setStreaming,
        setError,
        clearError,
        activeConversationId,
    } = useChatStore();

    const sendMessage = useCallback(
        async (content: string) => {
            clearError();

            // Create conversation if none exists
            let conversationId = activeConversationId;
            if (!conversationId) {
                conversationId = createConversation();
            }

            // Add user message
            addMessage(conversationId, {
                role: 'user',
                content,
            });

            // Create placeholder for assistant message
            const assistantMessageId = addMessage(conversationId, {
                role: 'assistant',
                content: '',
                isStreaming: true,
            });

            setStreaming(true);

            try {
                // Create abort controller for this request
                abortControllerRef.current = new AbortController();

                // Get current messages for context
                const currentConversation = useChatStore.getState().conversations.find(
                    (c) => c.id === conversationId
                );
                const messages = currentConversation?.messages
                    .filter((m) => m.role !== 'system' && m.id !== assistantMessageId)
                    .map((m) => ({
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                    })) || [];

                // Start streaming request
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages }),
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const reader = response.body?.getReader();
                if (!reader) throw new Error('No response body');

                const decoder = new TextDecoder();
                let accumulatedContent = '';
                let accumulatedReasoning = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);

                                if (parsed.error) {
                                    throw new Error(parsed.error);
                                }

                                if (parsed.content) {
                                    accumulatedContent += parsed.content;
                                }
                                if (parsed.reasoning_content) {
                                    accumulatedReasoning += parsed.reasoning_content;
                                }

                                // Update message with accumulated content
                                updateMessage(conversationId, assistantMessageId, {
                                    content: accumulatedContent,
                                    reasoning_content: accumulatedReasoning || undefined,
                                    isStreaming: true,
                                });
                            } catch (parseError) {
                                // Skip malformed JSON chunks
                                if (data !== '[DONE]') {
                                    console.warn('Failed to parse chunk:', data);
                                }
                            }
                        }
                    }
                }

                // Mark streaming as complete
                updateMessage(conversationId, assistantMessageId, {
                    isStreaming: false,
                });
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    // Request was aborted, this is expected
                    updateMessage(conversationId, assistantMessageId, {
                        content: accumulatedContent || 'Message generation was cancelled.',
                        isStreaming: false,
                    });
                } else {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    setError(errorMessage);
                    onError?.(error instanceof Error ? error : new Error(errorMessage));

                    // Update message with error state
                    updateMessage(conversationId, assistantMessageId, {
                        content: 'An error occurred while generating the response. Please try again.',
                        isStreaming: false,
                    });
                }
            } finally {
                setStreaming(false);
                abortControllerRef.current = null;
            }
        },
        [
            activeConversationId,
            createConversation,
            addMessage,
            updateMessage,
            setStreaming,
            setError,
            clearError,
            onError,
        ]
    );

    const abortStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    return {
        messages: activeConversation?.messages || [],
        isStreaming,
        sendMessage,
        abortStream,
    };
}

// Variable to track accumulated content for error handling
let accumulatedContent = '';
