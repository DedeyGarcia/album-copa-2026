import { Tabs } from 'expo-router';
import { LayoutDashboard, UserCircle } from 'lucide-react-native'; // Ou seus ícones de preferência

export default function TabLayout() {
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
    </Tabs>
  );
}
