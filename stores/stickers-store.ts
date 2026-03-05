import { supabase } from '@/lib/supabase/supabase';
import { Sticker } from '@/types';
import { create } from 'zustand';

type StickersState = {
  stickers: Sticker[];
  isLoading: boolean;
};

type StickersActions = {
  fetchStickers: () => Promise<void>;
};

const initialState: StickersState = {
  stickers: [],
  isLoading: false,
};

export const useStickersStore = create<StickersState & StickersActions>((set) => ({
  ...initialState,
  fetchStickers: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
      .order('album_index', { ascending: true });
    if (error) {
      console.error('Error fetching stickers:', error);
      set({ isLoading: false });
      return;
    }
    set({ stickers: data, isLoading: false });
  },
}));
