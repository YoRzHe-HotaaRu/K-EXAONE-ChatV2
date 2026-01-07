'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn, truncate, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Conversation } from '@/types/chat';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
}

export function ConversationItem({
    conversation,
    isActive,
    onClick,
    onDelete,
}: ConversationItemProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            whileHover={{ x: 2 }}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            className={cn(
                'group w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer',
                'hover:bg-[var(--gray-100)] [html[data-theme="dark"]_&]:hover:bg-[var(--gray-800)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--purple-400)] focus:ring-offset-2',
                isActive && 'bg-[var(--purple-50)] hover:bg-[var(--purple-50)] [html[data-theme="dark"]_&]:bg-[var(--purple-500)]/20 [html[data-theme="dark"]_&]:hover:bg-[var(--purple-500)]/20'
            )}
            data-testid="conversation-item"
            aria-selected={isActive}
        >
            <div className="flex items-start gap-3">
                <div className={cn(
                    'flex-shrink-0 p-2 rounded-lg transition-colors',
                    isActive
                        ? 'bg-[var(--purple-100)] text-[var(--purple-500)] [html[data-theme="dark"]_&]:bg-[var(--purple-500)]/30'
                        : 'bg-[var(--gray-100)] text-[var(--foreground-muted)] [html[data-theme="dark"]_&]:bg-[var(--gray-700)]'
                )}>
                    <MessageSquare className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        'font-medium text-sm truncate',
                        isActive ? 'text-[var(--purple-600)] [html[data-theme="dark"]_&]:text-[var(--purple-300)]' : 'text-[var(--foreground)]'
                    )}>
                        {truncate(conversation.title, 30)}
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                        {formatDate(conversation.updatedAt)}
                    </p>
                </div>

                {/* Delete Button */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleDelete}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--foreground-muted)] hover:text-red-500"
                    aria-label="Delete conversation"
                    data-testid="delete-conversation"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
