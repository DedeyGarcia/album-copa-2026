import { View, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAppTheme } from '@/hooks/use-app-theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ value, onChangeText, placeholder, className }: SearchBarProps) => {
  const { colors } = useAppTheme();

  return (
    <View className={cn('relative flex-row items-center', className)}>
      <View className="absolute left-3 z-10">
        <Search size={18} color={colors.mutedForeground} />
      </View>
      
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="w-full pl-10 pr-10"
      />
      
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          className="absolute right-3 z-10 p-1"
          activeOpacity={0.7}
        >
          <X size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
