import { useMemo } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useStickersStore } from '@/stores/stickers-store';
import { Sticker } from '@/types';

type ListItem = { type: 'header'; title: string } | { type: 'row'; data: Sticker[] };

export default function AlbumScreen() {
  const { stickers } = useStickersStore();
  const insets = useSafeAreaInsets();

  const listData = useMemo(() => {
    if (!stickers || stickers.length === 0) return [];

    const sorted = [...stickers].sort((a, b) => a.album_index - b.album_index);

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
  }, [stickers]);

  const renderItem = ({ item }: { item: ListItem }) => {
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
  };

  return (
    <View className="bg-background flex-1">
      <FlashList
        data={listData}
        // @ts-ignore
        estimatedItemSize={120}
        getItemType={(item) => item.type}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          paddingTop: insets.top + 16,
        }}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${item.title}` : `row-${item.data[0].code}`
        }
        renderItem={renderItem}
      />
    </View>
  );
}
