'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useThemeStore } from '@/stores/themeStore';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useThemeStore();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--purple-400)] via-[var(--pink-400)] to-[var(--orange-400)]" />
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatInterface />
      </div>
    </main>
  );
}
