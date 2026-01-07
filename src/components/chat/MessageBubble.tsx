'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, User } from 'lucide-react';
import Image from 'next/image';
import { cn, formatTime } from '@/lib/utils';
import { ReasoningBlock } from './ReasoningBlock';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
    message: Message;
    isLast?: boolean;
}

export function MessageBubble({ message, isLast = false }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';
    const isStreaming = message.isStreaming;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'flex gap-2 md:gap-3 py-3 md:py-4',
                isUser ? 'justify-end' : 'justify-start'
            )}
            data-testid={`message-${message.role}`}
        >
            {/* Assistant Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg overflow-hidden gradient-border bg-[var(--background)]">
                    <Image
                        src="/logo.png"
                        alt="K-EXAONE"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Message Content */}
            <div className={cn(
                'max-w-[85%] md:max-w-[80%] lg:max-w-[70%]',
                isUser && 'order-first'
            )}>
                {/* Reasoning Block (only for assistant) */}
                {!isUser && message.reasoning_content && (
                    <ReasoningBlock
                        content={message.reasoning_content}
                        isStreaming={isStreaming && !message.content}
                    />
                )}

                {/* Message Bubble */}
                <div className={cn(
                    'relative group rounded-2xl px-3 py-2 md:px-4 md:py-3',
                    isUser
                        ? 'gradient-border bg-[var(--background-secondary)] ml-auto'
                        : 'bg-[var(--message-assistant-bg)]'
                )}>
                    {/* Content */}
                    <div className={cn(
                        'prose prose-sm max-w-none',
                        isUser
                            ? 'text-[var(--foreground)]'
                            : 'text-[var(--foreground)]'
                    )}>
                        {isUser ? (
                            <p className="whitespace-pre-wrap m-0">{message.content}</p>
                        ) : (
                            <>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                        // Custom code block rendering
                                        code({ className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isInline = !match;

                                            if (isInline) {
                                                return (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }

                                            return (
                                                <div className="relative group/code my-3">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(String(children));
                                                            }}
                                                            className="p-1.5 rounded-md bg-[var(--gray-700)] hover:bg-[var(--gray-600)] text-white text-xs"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    {match && (
                                                        <div className="absolute top-2 left-3 text-xs text-gray-400 font-mono">
                                                            {match[1]}
                                                        </div>
                                                    )}
                                                    <pre className="!mt-0 pt-8">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                </div>
                                            );
                                        },
                                        // Custom link rendering
                                        a({ href, children }) {
                                            return (
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--purple-500)] hover:text-[var(--pink-500)] underline underline-offset-2"
                                                >
                                                    {children}
                                                </a>
                                            );
                                        },
                                    }}
                                >
                                    {message.content || ' '}
                                </ReactMarkdown>

                                {/* Streaming cursor */}
                                {isStreaming && message.content && (
                                    <motion.span
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="inline-block w-2 h-5 bg-[var(--purple-400)] ml-0.5 align-middle rounded-full"
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Copy Button (only for assistant, not streaming) */}
                    {!isUser && !isStreaming && message.content && (
                        <button
                            onClick={handleCopy}
                            className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-[var(--background)] hover:bg-[var(--gray-100)] [html[data-theme='dark']_&]:hover:bg-[var(--gray-800)] shadow-sm border border-[var(--gray-200)] [html[data-theme='dark']_&]:border-[var(--gray-700)]"
                            aria-label="Copy message"
                            data-testid="copy-button"
                        >
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                            )}
                        </button>
                    )}
                </div>

                {/* Timestamp */}
                <div className={cn(
                    'mt-1 px-1 text-xs text-[var(--foreground-muted)]',
                    isUser ? 'text-right' : 'text-left'
                )}>
                    {formatTime(message.createdAt)}
                </div>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-[var(--purple-400)] via-[var(--pink-400)] to-[var(--orange-400)] flex items-center justify-center">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
            )}
        </motion.div>
    );
}
