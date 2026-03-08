import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import SectionFilterModal, { SECTION_MAP } from '@/components/shared/section-filter-modal';
import { cn } from '@/lib/utils';

interface DuplicatesSectionFilterProps {
  availableSections: string[];
  selectedSection: string | null;
  onSelect: (section: string | null) => void;
}

const DuplicatesSectionFilter = ({
  availableSections,
  selectedSection,
  onSelect,
}: DuplicatesSectionFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-2 w-full">
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-muted flex-row items-center justify-between rounded-md px-4 py-3"
      >
        <Text className={cn(
          "text-base font-medium",
          selectedSection ? "text-primary" : "text-muted-foreground"
        )}>
          {selectedSection 
            ? `${SECTION_MAP[selectedSection]?.icon || '🏳️'} ${selectedSection}` 
            : 'Filtre por País...'}
        </Text>
        <ChevronDown className="text-muted-foreground" size={20} />
      </TouchableOpacity>

      <SectionFilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        availableSections={availableSections}
        selectedSection={selectedSection}
        onSelect={onSelect}
      />
    </View>
  );
};

export default DuplicatesSectionFilter;
