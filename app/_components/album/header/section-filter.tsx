import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Menu } from 'lucide-react-native';
import SectionFilterModal from '@/components/shared/section-filter-modal';

interface SectionFilterProps {
  availableSections: string[];
  selectedSection: string | null;
  onSelect: (section: string | null) => void;
}

const SectionFilter = ({
  availableSections,
  selectedSection,
  onSelect,
}: SectionFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-muted relative items-center justify-center rounded-md p-2">
        <Menu className="text-foreground" size={20} />
        {selectedSection && (
          <View className="bg-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
        )}
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

export default SectionFilter;
