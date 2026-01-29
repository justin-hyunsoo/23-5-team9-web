import { create } from 'zustand';

interface ChatNavigationState {
  lastPath: string;
  setLastPath: (path: string) => void;
}

const STORAGE_KEY = 'chat-last-path';

const getInitialPath = (): string => {
  if (typeof window === 'undefined') return '/chat';
  return localStorage.getItem(STORAGE_KEY) || '/chat';
};

export const useChatNavigationStore = create<ChatNavigationState>((set) => ({
  lastPath: getInitialPath(),

  setLastPath: (path) => {
    localStorage.setItem(STORAGE_KEY, path);
    set({ lastPath: path });
  },
}));
