import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import { useDuplicatesFiltersStore } from '@/stores/duplicates-filters-store';
import { View } from 'react-native';

interface EmptyStateProps {
  message?: string;
  isDuplicatesScreen?: boolean;
}

const EmptyState = ({ message, isDuplicatesScreen = false }: EmptyStateProps) => {
  const stickerFilters = useStickerFiltersStore();
  const duplicateFilters = useDuplicatesFiltersStore();

  const handleClearFilters = () => {
    if (isDuplicatesScreen) {
      duplicateFilters.resetFilters();
    } else {
      stickerFilters.setSearchQuery('');
      stickerFilters.setSelectedSection(null);
      stickerFilters.setFilterBy('all');
    }
  };

  return (
    <View className="items-center justify-center px-10 py-20">
      <Text className="text-muted-foreground text-center text-lg">
        {message || 'Nenhuma figurinha encontrada para os filtros selecionados.'}
      </Text>
      <Button
        onPress={handleClearFilters}
        className="mt-4 rounded-full px-6 py-2">
        <Text>Limpar Filtros</Text>
      </Button>
    </View>
  );
};

export default EmptyState;
