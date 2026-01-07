'use client';

import React from 'react';
import { AnimatePresence } from 'motion/react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { useChat } from '@/hooks/useChat';
import { useChatError } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

export function ChatInterface() {
    const { messages, isStreaming, sendMessage, abortStream } = useChat();
    const error = useChatError();

    const hasMessages = messages.length > 0;

    const handleSuggestionClick = (prompt: string) => {
        sendMessage(prompt);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden" data-testid="chat-interface">
            {/* Messages or Welcome */}
            <AnimatePresence mode="wait">
                {hasMessages ? (
                    <MessageList messages={messages} isStreaming={isStreaming} />
                ) : (
                    <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
                )}
            </AnimatePresence>

            {/* Error Display */}
            {error && (
                <div className="mx-auto max-w-3xl w-full px-4 mb-2">
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm [html[data-theme='dark']_&]:bg-red-500/10 [html[data-theme='dark']_&]:border-red-500/30 [html[data-theme='dark']_&]:text-red-400">
                        {error}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className={cn(
                'flex-shrink-0 px-4 pb-4 pt-2',
                'bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent'
            )}>
                <ChatInput
                    onSend={sendMessage}
                    onAbort={abortStream}
                    isStreaming={isStreaming}
                />
            </div>
        </div>
    );
}
