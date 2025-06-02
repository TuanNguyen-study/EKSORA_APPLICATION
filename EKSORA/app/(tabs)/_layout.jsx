import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import { Label } from '@react-navigation/elements';

const TabArr = [
  {route: 'home/index', Label:'Trang chủ', type: Ionicons, activeIcon:'home',inActiveIcon:'home-filled',component: COLORS},
  {route: 'offers/index', lable:'Ưu đãi',type:Ionicons,activeIcon:''}
];

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.text,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="offers/index"
          options={{
            title: 'Ưu đãi',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetag-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites/index"
          options={{
            title: 'Yêu thích',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="trips/index"
          options={{
            title: 'Chuyến đi',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="airplane-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account/index"
          options={{
            title: 'Tài khoản',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  tabBar: {
    backgroundColor: COLORS.white,
    paddingBottom: Platform.OS === 'ios' ? 10 : 5,
    height: Platform.OS === 'ios' ? 80 : 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.text + '20',
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
});