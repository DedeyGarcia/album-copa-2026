import { supabase } from '@/lib/supabase/supabase';
import { UserSticker } from '@/types';
import { create } from 'zustand/react';
import { useAuthStore } from './auth-store';

type UserStickersState = {
  userStickers: UserSticker[];
  isLoading: boolean;
};

type UserStickersActions = {
  fetchUserStickers: () => Promise<void>;
};

const initialState: UserStickersState = {
  userStickers: [],
  isLoading: false,
};

export const useUserStickersStore = create<UserStickersState & UserStickersActions>((set) => ({
  ...initialState,
  fetchUserStickers: async () => {
    set({ isLoading: true });

    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;

    if (!userId) {
      console.error('Fetch abortado: Sessão não encontrada na AuthStore');
      return;
    }

    const { data, error } = await supabase.from('user_stickers').select('*').eq('user_id', userId);

    if (error) {
      console.error('Error fetching stickers:', error);
      set({ isLoading: false });
      return;
    }
    set({ userStickers: data, isLoading: false });
  },
}));
