import { Sticker } from '@/types';

export type ListItem = { type: 'header'; title: string } | { type: 'row'; data: Sticker[] };

/** Strips accents/diacritics and lowercases the string for accent-insensitive comparison */
const normalize = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

interface GenerateListDataOptions {
  stickers: Sticker[] | null;
  ownedStickers: Map<string, number>;
  searchQuery?: string;
  selectedSection?: string | null;
  filterBy?: 'all' | 'owned' | 'missing';
  onlyDuplicates?: boolean;
}

export const generateStickerListData = ({
  stickers,
  ownedStickers,
  searchQuery = '',
  selectedSection = null,
  filterBy = 'all',
  onlyDuplicates = false,
}: GenerateListDataOptions): ListItem[] => {
  if (!stickers || stickers.length === 0) return [];

  const normalizedQuery = normalize(searchQuery || '');

  const filteredStickers = stickers.filter((sticker) => {
    const ownedQuantity = ownedStickers.get(sticker.code) || 0;


    if (onlyDuplicates) {
      if (ownedQuantity <= 1) return false;
    } else {

      const isOwned = ownedQuantity > 0;
      if (filterBy === 'owned' && !isOwned) return false;
      if (filterBy === 'missing' && isOwned) return false;
    }


    if (selectedSection && sticker.section !== selectedSection) return false;


    if (normalizedQuery) {
      const matchesSearch =
        normalize(sticker.code).includes(normalizedQuery) ||
        (sticker.name ? normalize(sticker.name).includes(normalizedQuery) : false);

      if (!matchesSearch) return false;
    }

    return true;
  });

  const sorted = [...filteredStickers].sort((a, b) => a.album_index - b.album_index);

  const grouped = sorted.reduce(
    (acc, sticker) => {
      if (!acc[sticker.section]) acc[sticker.section] = [];
      acc[sticker.section].push(sticker);
      return acc;
    },
    {} as Record<string, Sticker[]>
  );

  const flattened: ListItem[] = [];

  Object.entries(grouped).forEach(([sectionTitle, sectionStickers]) => {
    flattened.push({ type: 'header', title: sectionTitle });

    for (let i = 0; i < sectionStickers.length; i += 5) {
      flattened.push({
        type: 'row',
        data: sectionStickers.slice(i, i + 5),
      });
    }
  });

  return flattened;
};
