import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Theme, ThemeState } from '@/types/chat';

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',

            setTheme: (theme: Theme) => {
                set({ theme });
                if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-theme', theme);
                }
            },

            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },
        }),
        {
            name: 'k-exaone-theme',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                // Apply theme on hydration
                if (state && typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-theme', state.theme);
                }
            },
        }
    )
);
