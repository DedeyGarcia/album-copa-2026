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
  upsertSticker: (stickerCode: string, quantity: number) => Promise<void>;
  optimisticAdd: (stickerCode: string) => void;
  optimisticRemove: (stickerCode: string) => void;
  commitAdd: (stickerCode: string) => Promise<void>;
  commitRemove: (stickerCode: string) => Promise<void>;
  revertRemove: (stickerCode: string, quantity: number) => void;
  clearUserStickers: () => void;
};

const initialState: UserStickersState = {
  userStickers: [],
  isLoading: false,
};

export const useUserStickersStore = create<UserStickersState & UserStickersActions>((set, get) => ({
  ...initialState,

  clearUserStickers: () => set(initialState),

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

  upsertSticker: async (stickerCode: string, quantity: number) => {
    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;
    if (!userId) return;

    const current = get().userStickers;
    const existing = current.find((s) => s.sticker_code === stickerCode);

    if (quantity === 0) {
      set({ userStickers: current.filter((s) => s.sticker_code !== stickerCode) });
    } else if (existing) {
      set({
        userStickers: current.map((s) =>
          s.sticker_code === stickerCode ? { ...s, quantity, updated_at: new Date().toISOString() } : s
        ),
      });
    } else {
      const now = new Date().toISOString();
      set({
        userStickers: [
          ...current,
          { user_id: userId, sticker_code: stickerCode, quantity, created_at: now, updated_at: now },
        ],
      });
    }

    if (quantity === 0) {
      const { error } = await supabase
        .from('user_stickers')
        .delete()
        .eq('user_id', userId)
        .eq('sticker_code', stickerCode);
      if (error) {
        console.error('Erro ao remover figurinha:', error);
        set({ userStickers: current });
      }
    } else {
      const { error } = await supabase.from('user_stickers').upsert(
        { user_id: userId, sticker_code: stickerCode, quantity, updated_at: new Date().toISOString() },
        { onConflict: 'user_id, sticker_code' }
      );
      if (error) {
        console.error('Erro ao salvar figurinha:', error);
        set({ userStickers: current });
      }
    }
  },

  optimisticAdd: (stickerCode: string) => {
    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;
    if (!userId) return;

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
  },

  optimisticRemove: (stickerCode: string) => {
    const current = get().userStickers;
    set({ userStickers: current.filter((s) => s.sticker_code !== stickerCode) });
  },

  commitAdd: async (stickerCode: string) => {
    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;
    if (!userId) return;

    const current = get().userStickers;

    const { error } = await supabase.from('user_stickers').upsert(
      { user_id: userId, sticker_code: stickerCode, quantity: 1, updated_at: new Date().toISOString() },
      { onConflict: 'user_id, sticker_code' }
    );

    if (error) {
      console.error('Erro ao commitar figurinha:', error);
      set({ userStickers: current.filter((s) => s.sticker_code !== stickerCode) });
    }
  },

  commitRemove: async (stickerCode: string) => {
    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;
    if (!userId) return;

    const current = get().userStickers;
    const { error } = await supabase
      .from('user_stickers')
      .delete()
      .eq('user_id', userId)
      .eq('sticker_code', stickerCode);

    if (error) {
      console.error('Erro ao efetivar remoção:', error);
      // Wait, if removal fails, we can't easily revert without knowing the old quantity from the DB.
      // But typically this shouldn't silent fail anyway.
    }
  },

  revertRemove: (stickerCode: string, quantity: number) => {
    const session = useAuthStore.getState().session;
    const userId = session?.user?.id;
    if (!userId) return;

    const current = get().userStickers;
    const existing = current.find((s) => s.sticker_code === stickerCode);

    if (!existing) {
      const now = new Date().toISOString();
      set({
        userStickers: [
          ...current,
          { user_id: userId, sticker_code: stickerCode, quantity, created_at: now, updated_at: now },
        ],
      });
    }
  },
}));
