'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '@/types/chat';

interface MessageListProps {
    messages: Message[];
    isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming = false }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isStreaming]);

    if (messages.length === 0) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8"
            data-testid="message-list"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto py-4"
            >
                {messages.map((message, index) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        isLast={index === messages.length - 1}
                    />
                ))}

                {/* Scroll anchor */}
                <div ref={bottomRef} className="h-1" />
            </motion.div>
        </div>
    );
}
