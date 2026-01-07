'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReasoningBlockProps {
    content: string;
    isStreaming?: boolean;
}

export function ReasoningBlock({ content, isStreaming = false }: ReasoningBlockProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const wasStreamingRef = useRef(isStreaming);

    // Auto-collapse when streaming completes
    useEffect(() => {
        if (wasStreamingRef.current && !isStreaming) {
            // Streaming just finished, collapse the block
            setIsExpanded(false);
        }
        wasStreamingRef.current = isStreaming;
    }, [isStreaming]);

    if (!content && !isStreaming) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-3"
            data-testid="reasoning-block"
        >
            <div className="rounded-xl overflow-hidden border border-[var(--purple-200)] bg-gradient-to-r from-[var(--purple-50)] to-[var(--pink-50)] [html[data-theme='dark']_&]:border-[var(--purple-400)]/30 [html[data-theme='dark']_&]:from-[var(--purple-500)]/10 [html[data-theme='dark']_&]:to-[var(--pink-500)]/10">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/50 [html[data-theme='dark']_&]:hover:bg-white/5 transition-colors"
                    aria-expanded={isExpanded}
                    aria-controls="reasoning-content"
                    data-testid="reasoning-toggle"
                >
                    <div className="flex items-center gap-2">
                        <Brain className={cn(
                            'w-4 h-4',
                            isStreaming ? 'text-[var(--purple-500)] animate-pulse' : 'text-[var(--purple-400)]'
                        )} />
                        <span className="text-sm font-medium text-[var(--purple-600)] [html[data-theme='dark']_&]:text-[var(--purple-300)]">
                            {isStreaming ? 'Thinking...' : 'Reasoning'}
                        </span>
                        {isStreaming && (
                            <span className="thinking-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        )}
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4 text-[var(--purple-400)]" />
                    </motion.div>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            id="reasoning-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-3 pt-1">
                                <div className="text-sm text-[var(--foreground-secondary)] italic leading-relaxed whitespace-pre-wrap">
                                    {content || (
                                        <span className="opacity-50">Processing...</span>
                                    )}
                                    {isStreaming && (
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="inline-block w-1.5 h-4 bg-[var(--purple-400)] ml-0.5 align-middle rounded-full"
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
