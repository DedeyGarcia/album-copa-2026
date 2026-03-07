import { View } from 'react-native';
import { useStickersStore } from '@/stores/stickers-store';
import { AlbumProgress } from '@/components/shared/album-screen/header/album-progress';
import { CountryFilter } from '@/components/shared/album-screen/header/country-filter';
import { useStickerFiltersStore } from '@/stores/stickers-filters-store';
import { StatusFilter } from '@/components/shared/album-screen/header/status-filter';

export default function AlbumScreenHeader() {
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
}
