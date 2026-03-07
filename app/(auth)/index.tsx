import { View, Alert, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase/supabase';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = Linking.createURL('/');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (res.type === 'success' && res.url) {
          const urlObj = new URL(res.url);
          const params = new URLSearchParams(urlObj.hash.substring(1));

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-8">
      <View className="mb-12 items-center">
        <Image
          source={require('@/assets/images/logo-fifa.webp')}
          className="mb-6 h-48 w-48"
          resizeMode="contain"
        />
        <Text className="text-center text-3xl font-bold">Álbum Copa</Text>
        <Text className="mt-2 text-center text-gray-500">Complete sua coleção de figurinhas</Text>
      </View>
      <Button onPress={handleGoogleLogin} className="w-full">
        <Text className="font-semibold">Entrar com Google</Text>
      </Button>
    </View>
  );
};

export default LoginScreen;
