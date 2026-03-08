import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { Appearance } from 'react-native';
import { NAV_THEME } from '@/lib/theme';
import { useStickersStore } from '@/stores/stickers-store';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { supabase } from '@/lib/supabase/supabase';
import { useThemeStore } from '@/stores/theme-store';
import { useUserStickersStore } from '@/stores/user-stickers-store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const { fetchStickers } = useStickersStore((state) => state);
  const { fetchUserStickers } = useUserStickersStore((state) => state);
  const { theme } = useThemeStore();
  const segments = useSegments();
  const router = useRouter();

  const { session, isLoadingAuth, setSession } = useAuthStore();

  useEffect(() => {
    Appearance.setColorScheme(theme);
  }, [theme]);

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
  }, [session, isLoadingAuth, segments, router]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserStickers();
    });

    return () => subscription.unsubscribe();
  }, [setSession, fetchUserStickers]);

  useEffect(() => {
    const hideSplash = async () => {
      if (!isLoadingAuth) {
        // Wait a tiny bit to allow the router to stabilize its initial redirect
        await new Promise((resolve) => setTimeout(resolve, 500));
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [isLoadingAuth]);

  if (isLoadingAuth) {
    return null;
  }

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
};

export default RootLayout;
