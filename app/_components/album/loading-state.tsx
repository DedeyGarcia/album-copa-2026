import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

const LoadingState = () => {
  return (
    <View className="flex-1 items-center justify-center p-10">
      <ActivityIndicator size="large" className="text-primary" />
      <Text className="mt-4 text-muted-foreground font-medium animate-pulse">
        Carregando figurinhas...
      </Text>
    </View>
  );
};

export default LoadingState;
