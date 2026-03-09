import { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useStickersStore } from '@/stores/stickers-store';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import { useManageStickerStore } from '@/stores/manage-sticker-store';
import { useToastStore } from '@/stores/toast-store';
import { Sticker } from '@/types';
import LoadingState from '../_components/album/loading-state';
import DuplicatesHeader from '../_components/duplicates/header';
import StickerCard from '@/components/shared/sticker-card';
import ManageStickerModal from '@/components/shared/manage-sticker-modal';
import { useDuplicatesFiltersStore } from '@/stores/duplicates-filters-store';
import EmptyState from '@/components/shared/empty-state';
import { generateStickerListData, ListItem } from '@/utils/sticker-utils';

const DuplicatesScreen = () => {
  const { stickers, isLoading: isLoadingStickers } = useStickersStore();
  const { userStickers, isLoading: isLoadingUserStickers } = useUserStickersStore();
  const { searchQuery, selectedSection } = useDuplicatesFiltersStore();
  const { openModal } = useManageStickerStore();
  const { hideToast } = useToastStore();

  const insets = useSafeAreaInsets();
  const isInitialLoad = (isLoadingStickers || isLoadingUserStickers) && (!stickers || stickers.length === 0);

  const ownedStickers = useMemo(() => {
    const map = new Map<string, number>();
    userStickers.forEach((s) => map.set(s.sticker_code, s.quantity));
    return map;
  }, [userStickers]);

  const listData = useMemo(() => {
    return generateStickerListData({
      stickers,
      ownedStickers,
      searchQuery,
      selectedSection,
      onlyDuplicates: true,
    });
  }, [stickers, ownedStickers, searchQuery, selectedSection]);

  const handleStickerInteraction = useCallback((sticker: Sticker, quantity: number) => {
    hideToast();
    openModal(sticker, quantity);
  }, [hideToast, openModal]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return <Text className="text-foreground mt-6 mb-2 text-2xl font-bold">{item.title}</Text>;
    }

    return (
      <View className="flex-row">
        {item.data.map((sticker) => {
          const quantity = ownedStickers.get(sticker.code) || 0;
          return (
            <StickerCard
              key={sticker.code}
              sticker={sticker}
              quantity={quantity}
              showDuplicatesQuantity={true}
              onPress={() => handleStickerInteraction(sticker, quantity)}
              onLongPress={() => handleStickerInteraction(sticker, quantity)}
            />
          );
        })}
        {Array.from({ length: 5 - item.data.length }).map((_, idx) => (
          <View key={`empty-${idx}`} className="w-1/5 p-0.5" />
        ))}
      </View>
    );
  }, [ownedStickers, handleStickerInteraction]);

  return (
    <View style={{ paddingTop: insets.top }} className="bg-background flex-1">
      <DuplicatesHeader />
      <View className="flex-1">
        {isInitialLoad ? (
          <LoadingState />
        ) : (
          <FlashList
            data={listData}
            extraData={ownedStickers}
            getItemType={(item) => item.type}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 0 }}
            keyExtractor={(item) =>
              item.type === 'header' ? `header-${item.title}` : `row-${item.data[0].code}`
            }
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <EmptyState
                message="Nenhuma figurinha repetida encontrada com esses filtros."
                isDuplicatesScreen={true}
              />
            )}
          />
        )}
      </View>
      <ManageStickerModal />
    </View>
  );
};

export default DuplicatesScreen;
