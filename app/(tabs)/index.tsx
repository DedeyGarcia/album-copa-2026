import { useEffect, useMemo, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useStickersStore } from '@/stores/stickers-store';
import { Sticker } from '@/types';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import EmptyState from '@/components/shared/album-screen/empty-state';
import AlbumScreenHeader from '@/components/shared/album-screen/header';
import StickerCard from '@/components/shared/sticker-card';
import ManageStickerModal from '@/components/shared/manage-sticker-modal';
import LoadingState from '@/components/shared/album-screen/loading-state';

type ListItem = { type: 'header'; title: string } | { type: 'row'; data: Sticker[] };

const AlbumScreen = () => {
  const { stickers, isLoading: isLoadingStickers } = useStickersStore();
  const { selectedSection, filterBy, searchQuery } = useStickerFiltersStore();
  const { userStickers, isLoading: isLoadingUserStickers } = useUserStickersStore();

  const isLoading = isLoadingStickers || isLoadingUserStickers;
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<ListItem>>(null);

  const ownedStickers = useMemo(() => {
    const map = new Map<string, number>();
    userStickers.forEach((s) => {
       map.set(s.sticker_code, s.quantity);
    });
    return map;
  }, [userStickers]);

  const listData = useMemo(() => {
    if (!stickers || stickers.length === 0) return [];

    const lowerQuery = searchQuery?.toLowerCase() || '';

    const filteredStickers = stickers.filter((sticker) => {
      const matchesSection = !selectedSection || sticker.section === selectedSection;

      const ownedQuantity = ownedStickers.get(sticker.code) || 0;
      const isOwned = ownedQuantity > 0;
      let matchesStatus = true;
      if (filterBy === 'owned') matchesStatus = isOwned;
      if (filterBy === 'missing') matchesStatus = !isOwned;

      let matchesSearch = true;
      if (lowerQuery) {
        matchesSearch =
          sticker.code.toLowerCase().includes(lowerQuery) ||
          (sticker.name ? sticker.name.toLowerCase().includes(lowerQuery) : false);
      }

      return matchesSection && matchesStatus && matchesSearch;
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
  }, [stickers, selectedSection, filterBy, ownedStickers, searchQuery]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return <Text className="text-foreground mt-6 mb-2 text-2xl font-bold">{item.title}</Text>;
    }

    return (
      <View className="flex-row">
        {item.data.map((sticker) => (
          <StickerCard 
            key={sticker.code} 
            sticker={sticker} 
            quantity={ownedStickers.get(sticker.code) || 0} 
            showDuplicatesQuantity={false}
          />
        ))}

        {Array.from({ length: 4 - item.data.length }).map((_, idx) => (
          <View key={`empty-${idx}`} className="w-1/4 p-1" />
        ))}
      </View>
    );
  }, [ownedStickers]);

  useEffect(() => {
    listRef.current?.scrollToTop({ animated: true });
  }, [selectedSection, filterBy, searchQuery]);

  return (
    <View style={{ paddingTop: insets.top }} className="bg-background flex-1">
      <AlbumScreenHeader />
      <View className="flex-1">
        {isLoading ? (
          <LoadingState />
        ) : (
          <FlashList
            ref={listRef}
            data={listData}
            extraData={ownedStickers}
            getItemType={(item) => item.type}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 100,
              paddingTop: 0,
            }}
            keyExtractor={(item) =>
              item.type === 'header' ? `header-${item.title}` : `row-${item.data[0].code}`
            }
            renderItem={renderItem}
            ListEmptyComponent={EmptyState}
          />
        )}
      </View>
      <ManageStickerModal />
    </View>
  );
};

export default AlbumScreen;
