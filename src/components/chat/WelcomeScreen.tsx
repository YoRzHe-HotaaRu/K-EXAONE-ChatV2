'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Sparkles, Code, MessageCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
    onSuggestionClick?: (suggestion: string) => void;
}

const suggestions = [
    {
        icon: Code,
        title: 'Help me code',
        prompt: 'Write a Python function that implements binary search with detailed comments explaining each step.',
    },
    {
        icon: Lightbulb,
        title: 'Explain a concept',
        prompt: 'Explain the concept of machine learning to a beginner, using simple analogies and examples.',
    },
    {
        icon: MessageCircle,
        title: 'Analyze text',
        prompt: 'What are the key themes and writing techniques used in this paragraph? [paste your text]',
    },
    {
        icon: Sparkles,
        title: 'Be creative',
        prompt: 'Write a short, imaginative story about an AI that discovers it can dream.',
    },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center px-3 py-4 md:px-4 md:py-8 overflow-y-auto"
            data-testid="welcome-screen"
        >
            {/* Logo and Title */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center mb-4 md:mb-8"
            >
                <div className="relative w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-4">
                    <Image
                        src="/logo.png"
                        alt="K-EXAONE"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        priority
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-[var(--purple-400)] via-[var(--pink-400)] to-[var(--orange-400)]" />
                </div>

                <h1 className="text-2xl md:text-4xl font-bold font-[var(--font-display)] mb-1 md:mb-2">
                    <span className="gradient-text">K-EXAONE</span>
                </h1>
                <p className="text-[var(--foreground-secondary)] text-base md:text-lg">
                    Your intelligent AI assistant
                </p>
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center text-[var(--foreground-muted)] text-sm md:text-base max-w-md mb-4 md:mb-8 px-2"
            >
                Powered by LG AI Research. Ask me anything – from coding help to creative writing,
                analysis to explanations.
            </motion.p>

            {/* Suggestion Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 w-full max-w-4xl px-1"
            >
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={suggestion.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSuggestionClick?.(suggestion.prompt)}
                        className={cn(
                            'group text-left p-3 md:p-4 rounded-xl',
                            'bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)]',
                            'border border-[var(--gray-200)] hover:border-[var(--purple-300)]',
                            '[html[data-theme="dark"]_&]:border-[var(--gray-700)] [html[data-theme="dark"]_&]:hover:border-[var(--purple-500)]',
                            'transition-all duration-200'
                        )}
                        data-testid={`suggestion-${index}`}
                    >
                        <div className="flex items-start gap-2 md:gap-3">
                            <div className={cn(
                                'p-1.5 md:p-2 rounded-lg flex-shrink-0',
                                'bg-gradient-to-br from-[var(--purple-100)] via-[var(--pink-100)] to-[var(--orange-100)]',
                                '[html[data-theme="dark"]_&]:from-[var(--purple-500)]/20 [html[data-theme="dark"]_&]:via-[var(--pink-500)]/20 [html[data-theme="dark"]_&]:to-[var(--orange-500)]/20',
                                'group-hover:shadow-md transition-shadow'
                            )}>
                                <suggestion.icon className="w-4 h-4 md:w-5 md:h-5 text-[var(--purple-500)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm md:text-base text-[var(--foreground)] mb-0.5">
                                    {suggestion.title}
                                </h3>
                                <p className="text-xs md:text-sm text-[var(--foreground-muted)] line-clamp-2">
                                    {suggestion.prompt}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    );
}

