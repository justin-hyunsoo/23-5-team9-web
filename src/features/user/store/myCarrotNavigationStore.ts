import { create } from 'zustand';

interface MyCarrotNavigationState {
  lastPath: string;
  setLastPath: (path: string) => void;
}

const STORAGE_KEY = 'mycarrot-last-path';

const getInitialPath = (): string => {
  if (typeof window === 'undefined') return '/my';
  return localStorage.getItem(STORAGE_KEY) || '/my';
};

export const useMyCarrotNavigationStore = create<MyCarrotNavigationState>((set) => ({
  lastPath: getInitialPath(),

  setLastPath: (path) => {
    localStorage.setItem(STORAGE_KEY, path);
    set({ lastPath: path });
  },
}));
