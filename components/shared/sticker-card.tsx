import { View, TouchableOpacity } from 'react-native';
import { Sticker } from '@/types';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useManageStickerStore } from '@/stores/manage-sticker-store';

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  showDuplicatesQuantity?: boolean;
}

const StickerCard = ({ sticker, quantity, showDuplicatesQuantity = true }: StickerCardProps) => {
  const { openModal } = useManageStickerStore();
  
  const isOwned = quantity > 0;

  return (
    <View className="w-1/4 p-1">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openModal(sticker, quantity)}
      >
        <Card 
          className={cn(
            'aspect-[3/4] items-center justify-center p-0 overflow-hidden relative border',
            isOwned 
              ? 'bg-primary border-primary shadow-md' 
              : 'bg-card border-border/50 shadow-sm opacity-60' // not-owned look
          )}
        >
          {isOwned && quantity > 1 && showDuplicatesQuantity && (
             <View className="absolute top-1 right-1 bg-destructive rounded-full w-5 h-5 items-center justify-center z-10 shadow-sm">
                <Text className="text-destructive-foreground text-[10px] font-bold">
                  {quantity - 1}
                </Text>
             </View>
          )}

          <Text 
            className={cn(
              'font-bold text-center',
              isOwned ? 'text-primary-foreground text-sm' : 'text-muted-foreground text-sm'
            )}
          >
            {sticker.code}
          </Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

export default StickerCard;
