import { useEffect, useMemo, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useStickersStore } from '@/stores/stickers-store';
import { Sticker } from '@/types';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import { useManageStickerStore } from '@/stores/manage-sticker-store';
import { useToastStore } from '@/stores/toast-store';
import EmptyState from '@/components/shared/empty-state';
import AlbumScreenHeader from '../_components/album/header';
import StickerCard from '@/components/shared/sticker-card';
import ManageStickerModal from '@/components/shared/manage-sticker-modal';
import LoadingState from '../_components/album/loading-state';
import { generateStickerListData, ListItem } from '@/utils/sticker-utils';
import { playStickerSound } from '@/utils/sound';

const AlbumScreen = () => {
  const { stickers, isLoading: isLoadingStickers } = useStickersStore();
  const { selectedSection, filterBy, searchQuery } = useStickerFiltersStore();
  const { userStickers, isLoading: isLoadingUserStickers, optimisticAdd, optimisticRemove, commitAdd, commitRemove, revertRemove, upsertSticker } = useUserStickersStore();
  const { openModal } = useManageStickerStore();
  const { showToast, hideToast } = useToastStore();

  const isInitialLoad = (isLoadingStickers || isLoadingUserStickers) && (!stickers || stickers.length === 0);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<ListItem>>(null);

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
      filterBy,
      onlyDuplicates: false,
    });
  }, [stickers, selectedSection, filterBy, ownedStickers, searchQuery]);

  const handleStickerPress = useCallback((sticker: Sticker, quantity: number) => {
    if (quantity === 0) {
      hideToast();
      playStickerSound();
      optimisticAdd(sticker.code);
      showToast('', 'undo_add', {
        code: sticker.code,
        onTimeout: () => commitAdd(sticker.code),
        onUndo: () => optimisticRemove(sticker.code),
      });
    } else {
      hideToast();
      openModal(sticker, quantity);
    }
  }, [hideToast, optimisticAdd, optimisticRemove, commitAdd, openModal, showToast]);

  const handleStickerLongPress = useCallback((sticker: Sticker, quantity: number) => {
    hideToast();
    openModal(sticker, quantity);
  }, [hideToast, openModal]);

  const handleDeleteSuccess = useCallback((code: string, previousQuantity: number) => {
    playStickerSound();
    showToast('', 'undo_remove', {
      code,
      onTimeout: () => commitRemove(code),
      onUndo: () => revertRemove(code, previousQuantity),
    });
  }, [showToast, commitRemove, revertRemove]);

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
              showDuplicatesQuantity={false}
              onPress={() => handleStickerPress(sticker, quantity)}
              onLongPress={() => handleStickerLongPress(sticker, quantity)}
            />
          );
        })}
        {Array.from({ length: 5 - item.data.length }).map((_, idx) => (
          <View key={`empty-${idx}`} className="w-1/5 p-1" />
        ))}
      </View>
    );
  }, [ownedStickers, handleStickerPress, handleStickerLongPress]);

  const prevFilters = useRef({ selectedSection, filterBy, searchQuery });

  useEffect(() => {
    const hasFiltersChanged =
      prevFilters.current.selectedSection !== selectedSection ||
      prevFilters.current.filterBy !== filterBy ||
      prevFilters.current.searchQuery !== searchQuery;

    if (hasFiltersChanged) {
      listRef.current?.scrollToTop({ animated: true });
      prevFilters.current = { selectedSection, filterBy, searchQuery };
    }
  }, [selectedSection, filterBy, searchQuery]);

  return (
    <View style={{ paddingTop: insets.top }} className="bg-background flex-1">
      <AlbumScreenHeader />
      <View className="flex-1">
        {isInitialLoad ? (
          <LoadingState />
        ) : (
          <FlashList
            ref={listRef}
            data={listData}
            extraData={ownedStickers}
            getItemType={(item) => item.type}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 0 }}
            keyExtractor={(item) =>
              item.type === 'header' ? `header-${item.title}` : `row-${item.data[0].code}`
            }
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <EmptyState message="Nenhuma figurinha encontrada para os filtros selecionados." />
            )}
          />
        )}
      </View>
      <ManageStickerModal onDeleteSuccess={handleDeleteSuccess} />
    </View>
  );
};

export default AlbumScreen;
