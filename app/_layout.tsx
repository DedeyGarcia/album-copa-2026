import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { useStickersStore } from '@/stores/stickers-store';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useUniwind } from 'uniwind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { fetchStickers } = useStickersStore((state) => state);
  const { theme } = useUniwind();

  useEffect(() => {
    fetchStickers();
  }, [fetchStickers]);

  return (
    <ThemeProvider value={NAV_THEME[(theme ?? 'light') as keyof typeof NAV_THEME]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
