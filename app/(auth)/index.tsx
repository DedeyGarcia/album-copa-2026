import { View, Alert, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const { signInWithGoogle } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-8">
      <View className="mb-12 items-center">
        <Image
          source={require('@/assets/images/logo-fifa.webp')}
          className="mb-6 h-48 w-48"
          resizeMode="contain"
        />
        <Text className="text-center text-3xl font-bold">Álbum Copa</Text>
        <Text className="mt-2 text-center text-muted-foreground">Complete sua coleção de figurinhas</Text>
      </View>
      <Button onPress={handleGoogleLogin} className="w-full">
        <Text className="font-semibold">Entrar com Google</Text>
      </Button>
    </View>
  );
};

export default LoginScreen;
