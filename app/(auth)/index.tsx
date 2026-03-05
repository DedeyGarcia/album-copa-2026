import { View, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase/supabase';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
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
    <View className="flex-1 items-center justify-center bg-slate-100 p-4">
      <Text className="mb-8 text-2xl font-bold text-black">Meu Álbum de Figurinhas</Text>
      <Button onPress={handleGoogleLogin}>
        <Text>Entrar com Google</Text>
      </Button>
    </View>
  );
}
