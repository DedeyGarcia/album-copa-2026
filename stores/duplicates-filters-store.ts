import { create } from 'zustand';

type DuplicatesFiltersState = {
  selectedSection: string | null;
  searchQuery: string;
};

type DuplicatesFiltersActions = {
  setSelectedSection: (section: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
};

export const useDuplicatesFiltersStore = create<DuplicatesFiltersState & DuplicatesFiltersActions>(
  (set) => ({
    selectedSection: null,
    searchQuery: '',
    setSelectedSection: (section) => set({ selectedSection: section }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    resetFilters: () => set({ selectedSection: null, searchQuery: '' }),
  })
);
