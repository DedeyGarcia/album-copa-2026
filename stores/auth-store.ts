import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useUserStickersStore } from './user-stickers-store';

type AuthState = {
  session: Session | null;
  isLoadingAuth: boolean;
};

type AuthActions = {
  setSession: (session: Session | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  session: null,
  isLoadingAuth: true,
  setSession: (session) => set({ session, isLoadingAuth: false }),
  signInWithGoogle: async () => {
    try {
      const redirectUrl = Linking.createURL('/');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (res.type === 'success' && res.url) {
          const urlObj = new URL(res.url);
          const params = new URLSearchParams(urlObj.hash.substring(1));

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
          }
        }
      }
    } catch (error: any) {
      throw error;
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    useUserStickersStore.getState().clearUserStickers();
  },
}));
