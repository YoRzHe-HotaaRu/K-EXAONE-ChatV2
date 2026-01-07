'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string) => void;
    onAbort?: () => void;
    isStreaming?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSend,
    onAbort,
    isStreaming = false,
    disabled = false,
    placeholder = 'Message K-EXAONE...',
}: ChatInputProps) {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isStreaming && onAbort) {
            onAbort();
            return;
        }
        if (!input.trim() || disabled) return;
        onSend(input.trim());
        setInput('');
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Focus textarea on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative glass rounded-2xl overflow-hidden shadow-lg">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoResize
                        className="pr-14 bg-transparent border-0 focus:ring-0 min-h-[56px] py-4"
                        rows={1}
                        aria-label="Message input"
                        data-testid="chat-input"
                    />

                    {/* Send/Stop Button */}
                    <div className="absolute right-2 bottom-2">
                        <Button
                            type={isStreaming ? 'button' : 'submit'}
                            onClick={isStreaming ? onAbort : undefined}
                            disabled={disabled || (!input.trim() && !isStreaming)}
                            size="icon"
                            variant={isStreaming ? 'danger' : 'default'}
                            className={cn(
                                'rounded-xl transition-all duration-200',
                                isStreaming && 'animate-pulse-glow'
                            )}
                            aria-label={isStreaming ? 'Stop generating' : 'Send message'}
                            data-testid="send-button"
                        >
                            {isStreaming ? (
                                <Square className="w-4 h-4" />
                            ) : disabled ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Character count */}
                <div className="flex justify-between items-center mt-2 px-1">
                    <p className="text-xs text-[var(--foreground-muted)]">
                        Press Enter to send, Shift+Enter for new line
                    </p>
                    <p className={cn(
                        'text-xs transition-colors',
                        input.length > 4000
                            ? 'text-red-500'
                            : 'text-[var(--foreground-muted)]'
                    )}>
                        {input.length > 0 && `${input.length.toLocaleString()} characters`}
                    </p>
                </div>
            </form>
        </motion.div>
    );
}
