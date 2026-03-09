import { Tabs } from 'expo-router';
import { LayoutDashboard, UserCircle, Settings } from 'lucide-react-native';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meu Álbum',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="duplicates"
        options={{
          title: 'Repetidas',
          tabBarIcon: ({ color }) => <UserCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
