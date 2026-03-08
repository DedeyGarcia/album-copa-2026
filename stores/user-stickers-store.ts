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
  upsertSticker: (stickerCode: string) => Promise<void>;
};

const initialState: UserStickersState = {
  userStickers: [],
  isLoading: false,
};

export const useUserStickersStore = create<UserStickersState & UserStickersActions>((set, get) => ({
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
  upsertSticker: async (stickerCode: string) => {
    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;
    if (!userId) return;

    // Atualização otimista: reflete imediatamente na UI
    const current = get().userStickers;
    const existing = current.find((s) => s.sticker_code === stickerCode);
    if (!existing) {
      const now = new Date().toISOString();
      set({
        userStickers: [
          ...current,
          { user_id: userId, sticker_code: stickerCode, quantity: 1, created_at: now, updated_at: now },
        ],
      });
    }

    const { error } = await supabase.from('user_stickers').upsert(
      {
        user_id: userId,
        sticker_code: stickerCode,
        quantity: 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, sticker_code' }
    );

    if (error) {
      console.error('Erro ao adicionar figurinha:', error);
      // Reverte em caso de erro
      set({ userStickers: current });
    }
  },
}));
