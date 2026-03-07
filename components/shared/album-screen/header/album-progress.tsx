import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import { useStickersStore } from '@/stores/stickers-store';
import { useMemo } from 'react';

export function AlbumProgress() {
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
      <Card className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-semibold">Seu Progresso</Text>
          <Text className="text-muted-foreground text-sm">Carregando...</Text>
        </View>
        <View className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <View className="bg-primary h-full rounded-full" style={{ width: `0%` }} />
        </View>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-semibold">Seu Progresso</Text>
        <Text className="text-muted-foreground text-sm">
          {percentage}% ({collected}/{total})
        </Text>
      </View>
      <View className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <View className="bg-primary h-full rounded-full" style={{ width: `${percentage}%` }} />
      </View>
    </Card>
  );
}
