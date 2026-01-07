'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Plus, PanelLeftClose, PanelLeft, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationItem } from './ConversationItem';
import { useChatStore, useConversations } from '@/stores/chatStore';
import { useThemeStore } from '@/stores/themeStore';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const conversations = useConversations();
    const { activeConversationId, createConversation, setActiveConversation, deleteConversation } = useChatStore();
    const { theme, toggleTheme } = useThemeStore();

    const handleNewChat = () => {
        createConversation();
        // On mobile, close sidebar after selecting new chat
        if (window.innerWidth < 768) {
            onToggle();
        }
    };

    const handleConversationClick = (id: string) => {
        setActiveConversation(id);
        // On mobile, close sidebar after selecting a conversation
        if (window.innerWidth < 768) {
            onToggle();
        }
    };

    // Group conversations by date
    const groupedConversations = React.useMemo(() => {
        const today: typeof conversations = [];
        const yesterday: typeof conversations = [];
        const thisWeek: typeof conversations = [];
        const older: typeof conversations = [];

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
        const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

        conversations.forEach((conv) => {
            const convDate = new Date(conv.updatedAt);
            if (convDate >= todayStart) {
                today.push(conv);
            } else if (convDate >= yesterdayStart) {
                yesterday.push(conv);
            } else if (convDate >= weekStart) {
                thisWeek.push(conv);
            } else {
                older.push(conv);
            }
        });

        return { today, yesterday, thisWeek, older };
    }, [conversations]);

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        data-testid="sidebar-backdrop"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-y-0 left-0 z-40 md:relative md:z-0 flex-shrink-0 h-full overflow-hidden border-r border-[var(--gray-200)] [html[data-theme='dark']_&]:border-[var(--gray-800)] shadow-xl md:shadow-none"
                        data-testid="sidebar"
                    >
                        <div className="h-full w-[280px] flex flex-col bg-[var(--sidebar-bg)]">
                            {/* Header */}
                            <div className="flex-shrink-0 p-4 border-b border-[var(--gray-200)] [html[data-theme='dark']_&]:border-[var(--gray-800)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <Image
                                        src="/logo.png"
                                        alt="K-EXAONE"
                                        width={32}
                                        height={32}
                                        className="flex-shrink-0"
                                    />
                                    <span className="font-bold text-lg gradient-text">K-EXAONE</span>

                                    {/* Collapse Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={onToggle}
                                        className="ml-auto"
                                        aria-label="Close sidebar"
                                    >
                                        <PanelLeftClose className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* New Chat Button */}
                                <Button
                                    variant="default"
                                    onClick={handleNewChat}
                                    className="w-full justify-start gap-2 [html[data-theme='dark']_&]:text-white"
                                    data-testid="new-chat-button"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Chat
                                </Button>
                            </div>

                            {/* Conversations List */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {conversations.length === 0 ? (
                                    <div className="text-center py-8 text-[var(--foreground-muted)] text-sm">
                                        No conversations yet.
                                        <br />
                                        Start a new chat!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {groupedConversations.today.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-[var(--foreground-muted)] px-2 mb-1">Today</h3>
                                                <div className="space-y-1">
                                                    {groupedConversations.today.map((conv) => (
                                                        <ConversationItem
                                                            key={conv.id}
                                                            conversation={conv}
                                                            isActive={conv.id === activeConversationId}
                                                            onClick={() => handleConversationClick(conv.id)}
                                                            onDelete={() => deleteConversation(conv.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {groupedConversations.yesterday.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-[var(--foreground-muted)] px-2 mb-1">Yesterday</h3>
                                                <div className="space-y-1">
                                                    {groupedConversations.yesterday.map((conv) => (
                                                        <ConversationItem
                                                            key={conv.id}
                                                            conversation={conv}
                                                            isActive={conv.id === activeConversationId}
                                                            onClick={() => handleConversationClick(conv.id)}
                                                            onDelete={() => deleteConversation(conv.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {groupedConversations.thisWeek.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-[var(--foreground-muted)] px-2 mb-1">This Week</h3>
                                                <div className="space-y-1">
                                                    {groupedConversations.thisWeek.map((conv) => (
                                                        <ConversationItem
                                                            key={conv.id}
                                                            conversation={conv}
                                                            isActive={conv.id === activeConversationId}
                                                            onClick={() => handleConversationClick(conv.id)}
                                                            onDelete={() => deleteConversation(conv.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {groupedConversations.older.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-[var(--foreground-muted)] px-2 mb-1">Older</h3>
                                                <div className="space-y-1">
                                                    {groupedConversations.older.map((conv) => (
                                                        <ConversationItem
                                                            key={conv.id}
                                                            conversation={conv}
                                                            isActive={conv.id === activeConversationId}
                                                            onClick={() => handleConversationClick(conv.id)}
                                                            onDelete={() => deleteConversation(conv.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 p-4 border-t border-[var(--gray-200)] [html[data-theme='dark']_&]:border-[var(--gray-800)]">
                                <Button
                                    variant="ghost"
                                    onClick={toggleTheme}
                                    className="w-full justify-start gap-2"
                                    data-testid="theme-toggle"
                                >
                                    {theme === 'light' ? (
                                        <>
                                            <Moon className="w-4 h-4" />
                                            Dark Mode
                                        </>
                                    ) : (
                                        <>
                                            <Sun className="w-4 h-4" />
                                            Light Mode
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Toggle Button (when sidebar is closed) */}
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed top-4 left-4 z-50"
                >
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={onToggle}
                        className="shadow-md"
                        aria-label="Open sidebar"
                        data-testid="open-sidebar-button"
                    >
                        <PanelLeft className="w-5 h-5" />
                    </Button>
                </motion.div>
            )}
        </>
    );
}
