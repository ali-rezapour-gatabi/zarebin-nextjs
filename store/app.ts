import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type AppState = {
  isLoading: boolean;
  theme: ThemeMode;
};

type AppActions = {
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  hasAuth: boolean;
  setHasAuth: (value: boolean) => void;
};

export type ChatStore = AppState & AppActions;

export const useAppStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isSidebarOpen: false,
      theme: 'light',
      hasAuth: false,
      setHasAuth: (value) => set({ hasAuth: value }),

      setTheme: (mode) => {
        set({ theme: mode });
      },

      toggleTheme: () => {
        const current = get().theme;
        const next: ThemeMode = current === 'light' ? 'dark' : 'light';
        get().setTheme(next);
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
