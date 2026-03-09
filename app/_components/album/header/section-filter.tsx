import React, { useState } from 'react';
import SectionFilterModal, { SECTION_MAP } from '@/components/shared/section-filter-modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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

  const selectedIcon = selectedSection ? SECTION_MAP[selectedSection]?.icon : null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onPress={() => setIsOpen(true)}
        className="rounded-md"
      >
        {selectedIcon ? (
          <Text className="text-xl">{selectedIcon}</Text>
        ) : (
          <Text className="text-xl">🌎</Text>
        )}
      </Button>

      <SectionFilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        availableSections={availableSections}
        selectedSection={selectedSection}
        onSelect={onSelect}
      />
    </>
  );
};

export default SectionFilter;
