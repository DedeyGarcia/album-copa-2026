import { create } from 'zustand';

type ThemeState = {
  theme: 'light' | 'dark';
};

type ThemeActions = {
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState & ThemeActions>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));
