import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase/supabase';
import { View } from 'react-native';

const AlbumScreen = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Tela do Meu Álbum</Text>
      <Button onPress={handleLogout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

export default AlbumScreen;
