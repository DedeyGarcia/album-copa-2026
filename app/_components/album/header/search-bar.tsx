import { View, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ value, onChangeText, placeholder, className }: SearchBarProps) => {
  return (
    <View className={cn('relative flex-row items-center', className)}>
      <View className="absolute left-3 z-10">
        <Search size={18} className="text-muted-foreground" />
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
          <X size={16} className="text-muted-foreground" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
