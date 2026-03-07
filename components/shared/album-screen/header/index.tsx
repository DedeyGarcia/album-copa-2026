import { View } from 'react-native';
import { useStickersStore } from '@/stores/stickers-store';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import AlbumProgress from './album-progress';
import CountryFilter from './country-filter';
import StatusFilter from './status-filter';
import SearchBar from './search-bar';

const AlbumScreenHeader = () => {
  const { stickers } = useStickersStore();
  const { selectedSection, setSelectedSection, searchQuery, setSearchQuery } = useStickerFiltersStore();

  return (
    <View className="bg-background border-border/50 border-b px-4 pt-2 pb-2">
      <AlbumProgress />
      
      <View className="mt-4 mb-2">
        <SearchBar 
          placeholder="Pesquisar por código ou nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <CountryFilter
        availableSections={Array.from(new Set(stickers?.map((s) => s.section) || []))}
        selectedSection={selectedSection}
        onSelect={setSelectedSection}
      />
      <StatusFilter />
    </View>
  );
};

export default AlbumScreenHeader;
