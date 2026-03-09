import { useUserSettingsStore } from '@/stores/user-settings-store';
import { COLORS } from '@/lib/theme';

export const useAppTheme = () => {
  const { theme } = useUserSettingsStore();
  
  const safeTheme = (theme === 'dark' || theme === 'light' ? theme : 'light') as 'light' | 'dark';
  
  return {
    theme: safeTheme,
    colors: COLORS[safeTheme],
    isDark: safeTheme === 'dark',
  };
};
