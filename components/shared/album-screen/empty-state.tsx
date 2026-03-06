import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import { View } from 'react-native';

const EmptyState = () => {
  const { setSelectedSection, setFilterBy } = useStickerFiltersStore();

  return (
    <View className="items-center justify-center px-10 py-20">
      <Text className="text-muted-foreground text-center text-lg">
        Nenhuma figurinha encontrada para os filtros selecionados.
      </Text>
      <Button
        onPress={() => {
          setSelectedSection(null);
          setFilterBy('all');
        }}
        className="mt-4 rounded-full px-6 py-2">
        <Text>Limpar Filtros</Text>
      </Button>
    </View>
  );
};

export default EmptyState;
