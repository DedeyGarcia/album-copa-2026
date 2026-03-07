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
import EmptyState from '@/components/shared/album-screen/header/empty-state';
import AlbumScreenHeader from '@/components/shared/album-screen/header';

type ListItem = { type: 'header'; title: string } | { type: 'row'; data: Sticker[] };

export default function AlbumScreen() {
  const { stickers } = useStickersStore();
  const { selectedSection, filterBy } = useStickerFiltersStore();
  const { userStickers } = useUserStickersStore();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<ListItem>>(null);

  const ownedStickers = useMemo(() => {
    return new Set(userStickers.map((s) => s.sticker_code));
  }, [userStickers]);

  const listData = useMemo(() => {
    if (!stickers || stickers.length === 0) return [];

    const filteredStickers = stickers.filter((sticker) => {
      const matchesSection = !selectedSection || sticker.section === selectedSection;

      const isOwned = ownedStickers.has(sticker.code);
      let matchesStatus = true;
      if (filterBy === 'owned') matchesStatus = isOwned;
      if (filterBy === 'missing') matchesStatus = !isOwned;

      return matchesSection && matchesStatus;
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
  }, [stickers, selectedSection, filterBy, ownedStickers]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return <Text className="text-foreground mt-6 mb-2 text-2xl font-bold">{item.title}</Text>;
    }

    return (
      <View className="flex-row">
        {item.data.map((sticker) => (
          <View key={sticker.code} className="w-1/4 p-1">
            <Card className={`bg-card aspect-[3/4] items-center justify-center shadow-sm`}>
              <Text className="text-card-foreground font-bold">{sticker.code}</Text>
            </Card>
          </View>
        ))}

        {Array.from({ length: 4 - item.data.length }).map((_, idx) => (
          <View key={`empty-${idx}`} className="w-1/4 p-1" />
        ))}
      </View>
    );
  }, []);

  useEffect(() => {
    listRef.current?.scrollToTop({ animated: true });
  }, [selectedSection, filterBy]);

  return (
    <View style={{ paddingTop: insets.top }} className="bg-background flex-1">
      <AlbumScreenHeader />
      <View className="flex-1">
        <FlashList
          ref={listRef}
          data={listData}
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
      </View>
    </View>
  );
}
