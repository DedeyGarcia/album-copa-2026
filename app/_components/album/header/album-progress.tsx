import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import { useStickersStore } from '@/stores/stickers-store';
import { useMemo } from 'react';

const AlbumProgress = () => {
  const { userStickers, isLoading: isLoadingUserStickers } = useUserStickersStore((state) => state);
  const { stickers, isLoading: isLoadingStickers } = useStickersStore((state) => state);

  const isLoading = isLoadingUserStickers || isLoadingStickers;

  const collected = useMemo(() => {
    return userStickers.length;
  }, [userStickers]);

  const total = useMemo(() => {
    return stickers.length;
  }, [stickers]);

  const percentage = useMemo(() => {
    return total > 0 ? Math.round((collected / total) * 100) : 0;
  }, [collected, total]);

  if (isLoading) {
    return (
      <View className="flex-row items-center gap-3">
        <View className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
          <View className="bg-primary h-full rounded-full" style={{ width: '0%' }} />
        </View>
        <Text className="text-muted-foreground text-xs">…</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3">
      <View className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
        <View className="bg-primary h-full rounded-full" style={{ width: `${percentage}%` }} />
      </View>
      <Text className="text-muted-foreground text-xs font-semibold">
        {percentage}% ({collected}/{total})
      </Text>
    </View>
  );
};

export default AlbumProgress;
