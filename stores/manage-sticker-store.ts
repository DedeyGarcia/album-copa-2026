import { create } from 'zustand';
import { Sticker } from '@/types';

type ManageStickerState = {
  isOpen: boolean;
  selectedSticker: Sticker | null;
  currentQuantity: number;
};

type ManageStickerActions = {
  openModal: (sticker: Sticker, quantity: number) => void;
  closeModal: () => void;
};

export const useManageStickerStore = create<ManageStickerState & ManageStickerActions>((set) => ({
  isOpen: false,
  selectedSticker: null,
  currentQuantity: 0,
  openModal: (sticker, quantity) => set({ isOpen: true, selectedSticker: sticker, currentQuantity: quantity }),
  closeModal: () => set({ isOpen: false, selectedSticker: null }),
}));
