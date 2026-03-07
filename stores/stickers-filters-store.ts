import { create } from 'zustand';

export type FilterByOptions = 'all' | 'owned' | 'missing';

type StickerFiltersState = {
  selectedSection: string | null;
  filterBy: FilterByOptions;
  searchQuery: string;
};

type StickerFiltersActions = {
  setSelectedSection: (section: string | null) => void;
  setFilterBy: (filter: FilterByOptions) => void;
  setSearchQuery: (query: string) => void;
};

export const useStickerFiltersStore = create<StickerFiltersState & StickerFiltersActions>(
  (set) => ({
    selectedSection: null,
    filterBy: 'all',
    searchQuery: '',
    setSelectedSection: (section) => set({ selectedSection: section }),
    setFilterBy: (filter) => set({ filterBy: filter }),
    setSearchQuery: (query) => set({ searchQuery: query, filterBy: 'all', selectedSection: null }),
  })
);
