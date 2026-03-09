import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useUserProfileStore } from '@/stores/user-profile-store';
import { useUserSettingsStore } from '@/stores/user-settings-store';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { User, Volume2, Moon, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth-store';

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { profile, isLoadingProfile } = useUserProfileStore();
  const { theme, toggleTheme, soundEnabled, toggleSound } = useUserSettingsStore();
  const { signOut } = useAuthStore();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="px-4 py-6 border-b border-border/50">
        <Text className="text-3xl font-bold text-foreground">Ajustes</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center py-10 border-b border-border/50">
          <View className="w-24 h-24 rounded-full bg-muted justify-center items-center mb-4 overflow-hidden shadow-sm">
            {profile?.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }} 
                className="w-full h-full" 
                resizeMode="cover"
              />
            ) : (
              <User size={40} className="text-muted-foreground" />
            )}
          </View>
          <Text className="text-xl font-bold text-foreground">
            {isLoadingProfile ? 'Carregando...' : (profile?.name || 'Colecionador')}
          </Text>
        </View>

        <View className="px-4 py-6">
          <Text className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-4">
            Preferências
          </Text>

          <View className="gap-2">
            <View className="flex-row items-center justify-between bg-muted/30 p-4 rounded-xl">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-blue-500/10 justify-center items-center">
                  <Volume2 size={20} className="text-blue-500" />
                </View>
                <Text className="text-base font-medium text-foreground">Sons do App</Text>
              </View>
              <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
            </View>

            <View className="flex-row items-center justify-between bg-muted/30 p-4 rounded-xl">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-indigo-500/10 justify-center items-center">
                  <Moon size={20} className="text-indigo-500" />
                </View>
                <Text className="text-base font-medium text-foreground">Modo Escuro</Text>
              </View>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </View>
          </View>
        </View>

        <View className="px-4 py-2">
           <Button 
              variant="destructive"
              onPress={signOut}
              className="flex-row justify-start items-center gap-3 p-4 rounded-xl h-auto"
            >
              <View className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
                 <LogOut size={20} className="text-white" />
              </View>
              <Text className="text-base font-medium text-white">Sair da Conta</Text>
           </Button>
        </View>

      </ScrollView>

      <View className="py-6 items-center flex-row justify-center pb-8 border-t border-border/50 bg-muted/20">
        <Text className="text-sm text-muted-foreground font-medium">
          Desenvolvido por: <Text className="font-bold text-foreground">Andrey Garcia</Text>
        </Text>
      </View>
    </View>
  );
};

export default SettingsScreen;
