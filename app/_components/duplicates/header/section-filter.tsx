import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import SectionFilterModal, { SECTION_MAP } from '@/components/shared/section-filter-modal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppTheme } from '@/hooks/use-app-theme';

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
  const { colors } = useAppTheme();

  return (
    <>
      <Button
        variant="outline"
        onPress={() => setIsOpen(true)}
        className="mb-2 h-auto w-full flex-row items-center justify-between px-4 py-3"
      >
        <Text className={cn(
          "text-base font-medium",
          selectedSection ? "text-primary" : "text-muted-foreground"
        )}>
          {selectedSection 
            ? `${SECTION_MAP[selectedSection]?.icon || '🏳️'} ${selectedSection}` 
            : 'Filtre por País ou Seção...'}
        </Text>
        <ChevronDown color={colors.mutedForeground} size={20} />
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

export default DuplicatesSectionFilter;
