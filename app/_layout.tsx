import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { useStickersStore } from '@/stores/stickers-store';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useUniwind } from 'uniwind';
import { useAuthStore } from '@/stores/auth-store';
import { supabase } from '@/lib/supabase/supabase';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { fetchStickers } = useStickersStore((state) => state);
  const { theme } = useUniwind();
  const segments = useSegments();
  const router = useRouter();

  const { session, isLoadingAuth, setSession } = useAuthStore();

  useEffect(() => {
    fetchStickers();
  }, [fetchStickers]);

  useEffect(() => {
    if (isLoadingAuth) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isLoadingAuth, segments]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log({ session });
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[(theme ?? 'light') as keyof typeof NAV_THEME]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
