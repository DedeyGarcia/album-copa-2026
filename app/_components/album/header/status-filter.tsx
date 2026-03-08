import * as React from 'react';
import { View } from 'react-native';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Text } from '@/components/ui/text';
import { FilterByOptions, useStickerFiltersStore } from '@/stores/stickers-filters-store';

const StatusFilter = () => {
  const { filterBy, setFilterBy } = useStickerFiltersStore();

  return (
    <View className="flex-row items-center justify-center py-2">
      <ToggleGroup
        value={filterBy}
        onValueChange={(val) => {
          if (val) setFilterBy(val as FilterByOptions);
        }}
        type="single"
        className="bg-muted flex-row rounded-lg p-1">
        <ToggleGroupItem value="all" aria-label="Todas" className="px-4">
          <Text className="text-sm font-medium">Todas</Text>
        </ToggleGroupItem>

        <ToggleGroupItem value="owned" aria-label="Tenho" className="px-4">
          <Text className="text-sm font-medium">Tenho</Text>
        </ToggleGroupItem>

        <ToggleGroupItem value="missing" aria-label="Faltantes" className="px-4">
          <Text className="text-sm font-medium">Faltantes</Text>
        </ToggleGroupItem>
      </ToggleGroup>
    </View>
  );
};

export default StatusFilter;
