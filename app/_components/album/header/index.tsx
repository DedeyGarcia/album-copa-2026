import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useStickersStore } from '@/stores/stickers-store';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import AlbumProgress from './album-progress';
import SectionFilter from './section-filter';
import StatusFilter from './status-filter';
import SearchBar from '@/components/shared/search-bar';

const AlbumScreenHeader = () => {
  const { stickers } = useStickersStore();
  const { selectedSection, setSelectedSection, searchQuery, setSearchQuery } = useStickerFiltersStore();

  return (
    <View className="bg-background border-border/50 border-b px-4 pt-4 pb-2">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-foreground text-2xl font-bold">Albúm da Copa de 2026</Text>
        <SectionFilter
          availableSections={Array.from(new Set(stickers?.map((s) => s.section) || []))}
          selectedSection={selectedSection}
          onSelect={setSelectedSection}
        />
      </View>

      <AlbumProgress />
      
      <View className="mt-4 mb-2">
        <SearchBar 
          placeholder="Pesquisar por código ou nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <StatusFilter />
    </View>
  );
};

export default AlbumScreenHeader;
