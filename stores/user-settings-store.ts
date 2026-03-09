import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserSettingsState = {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
};

type UserSettingsActions = {
  toggleTheme: () => void;
  toggleSound: () => void;
};

export const useUserSettingsStore = create<UserSettingsState & UserSettingsActions>()(
  persist(
    (set) => ({
      theme: 'light',
      soundEnabled: true,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),
    }),
    {
      name: 'user-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
