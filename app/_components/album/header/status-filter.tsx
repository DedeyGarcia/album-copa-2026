import * as React from 'react';
import { View } from 'react-native';
import { Toggle } from '@/components/ui/toggle';
import { Text } from '@/components/ui/text';
import { FilterByOptions, useStickerFiltersStore } from '@/stores/stickers-filters-store';

const StatusFilter = () => {
  const { filterBy, setFilterBy } = useStickerFiltersStore();

  const options: { label: string; value: FilterByOptions }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Tenho', value: 'owned' },
    { label: 'Faltantes', value: 'missing' },
  ];

  return (
    <View className="flex-row items-center justify-start gap-2 py-2">
      {options.map((option) => (
        <Toggle
          key={option.value}
          variant="outline"
          size="sm"
          pressed={filterBy === option.value}
          onPressedChange={() => setFilterBy(option.value)}
        >
          <Text>{option.label}</Text>
        </Toggle>
      ))}
    </View>
  );
};

export default StatusFilter;
