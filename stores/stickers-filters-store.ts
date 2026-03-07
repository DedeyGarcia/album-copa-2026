import { create } from 'zustand';

export type FilterByOptions = 'all' | 'owned' | 'missing';

type StickerFiltersState = {
  selectedSection: string | null;
  filterBy: FilterByOptions;
};

type StickerFiltersActions = {
  setSelectedSection: (section: string | null) => void;
  setFilterBy: (filter: FilterByOptions) => void;
};

export const useStickerFiltersStore = create<StickerFiltersState & StickerFiltersActions>(
  (set) => ({
    selectedSection: null,
    filterBy: 'all',
    setSelectedSection: (section) => set({ selectedSection: section }),
    setFilterBy: (filter) => set({ filterBy: filter }),
  })
);
