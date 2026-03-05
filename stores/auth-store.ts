import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  isLoadingAuth: boolean;
};

type AuthActions = {
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  session: null,
  isLoadingAuth: true,
  setSession: (session) => set({ session, isLoadingAuth: false }),
}));
