import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { supabase } from '@/lib/supabase/supabase';
import { Button } from '@/components/ui/button';

const DuplicatesScreen = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Tela de Figurinhas Repetidas</Text>
      <Button onPress={handleLogout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

export default DuplicatesScreen;
