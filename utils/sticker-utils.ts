import { Sticker } from '@/types';

export type ListItem = { type: 'header'; title: string } | { type: 'row'; data: Sticker[] };

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

  const lowerQuery = searchQuery?.toLowerCase() || '';

  const filteredStickers = stickers.filter((sticker) => {
    const ownedQuantity = ownedStickers.get(sticker.code) || 0;

    // Se estamos na tela de duplicadas, a regra é estrita: ter mais de 1.
    if (onlyDuplicates) {
      if (ownedQuantity <= 1) return false;
    } else {
      // Regras de StatusFilter (só na tela normal)
      const isOwned = ownedQuantity > 0;
      if (filterBy === 'owned' && !isOwned) return false;
      if (filterBy === 'missing' && isOwned) return false;
    }

    // Filtro de Seção
    if (selectedSection && sticker.section !== selectedSection) return false;

    // Filtro de Pesquisa (Texto)
    if (lowerQuery) {
      const matchesSearch =
        sticker.code.toLowerCase().includes(lowerQuery) ||
        (sticker.name ? sticker.name.toLowerCase().includes(lowerQuery) : false);

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

    for (let i = 0; i < sectionStickers.length; i += 4) {
      flattened.push({
        type: 'row',
        data: sectionStickers.slice(i, i + 4),
      });
    }
  });

  return flattened;
};
