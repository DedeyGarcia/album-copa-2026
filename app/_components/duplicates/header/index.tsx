import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { LogOut } from 'lucide-react-native';
import { useStickersStore } from '@/stores/stickers-store';
import SearchBar from '@/components/shared/search-bar';
import DuplicatesSectionFilter from './section-filter';
import { useDuplicatesFiltersStore } from '@/stores/duplicates-filters-store';
import { useAuthStore } from '@/stores/auth-store';

const DuplicatesHeader = () => {
  const { stickers } = useStickersStore();
  const { searchQuery, setSearchQuery, selectedSection, setSelectedSection } = useDuplicatesFiltersStore();
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <View className="bg-background border-border/50 border-b px-4 pt-4 pb-2">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-foreground text-2xl font-bold">Figurinhas Repetidas</Text>
        <TouchableOpacity onPress={handleLogout} className="p-2">
          <LogOut size={20} className="text-destructive" />
        </TouchableOpacity>
      </View>

      <View className="mb-2">
        <SearchBar 
          placeholder="Pesquisar por código ou nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <DuplicatesSectionFilter
        availableSections={Array.from(new Set(stickers?.map((s) => s.section) || []))}
        selectedSection={selectedSection}
        onSelect={setSelectedSection}
      />
    </View>
  );
};

export default DuplicatesHeader;
