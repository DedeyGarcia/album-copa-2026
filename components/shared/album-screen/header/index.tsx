import { View } from 'react-native';
import { useStickersStore } from '@/stores/stickers-store';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import AlbumProgress from './album-progress';
import CountryFilter from './country-filter';
import StatusFilter from './status-filter';

const AlbumScreenHeader = () => {
  const { stickers } = useStickersStore();
  const { selectedSection, setSelectedSection } = useStickerFiltersStore();

  return (
    <View className="bg-background border-border/50 border-b px-4 pt-2 pb-2">
      <AlbumProgress />
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
