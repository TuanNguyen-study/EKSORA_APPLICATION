import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AnimatedTabBarIcon from "../../components/AnimatedTabBarIcon";

const TabArr = [
  {
    route: "home/index",
    label: "Trang chủ",
    type: Ionicons,
    activeIcon: "home",
    inActiveIcon: "home-outline",
  },
  {
    route: "offers/index",
    label: "Ưu đãi",
    type: Ionicons,
    activeIcon: "pricetag",
    inActiveIcon: "pricetag-outline",
  },
  {
    route: "favorites/index",
    label: "Yêu thích",
    type: Ionicons,
    activeIcon: "heart",
    inActiveIcon: "heart",
    isCustom: true,
  },
  {
    route: "trips/index",
    label: "Chuyến đi",
    type: Ionicons,
    activeIcon: "airplane",
    inActiveIcon: "airplane-outline",
  },
  {
    route: "account/index",
    label: "Tài khoản",
    type: Ionicons,
    activeIcon: "person",
    inActiveIcon: "person-outline",
  },
];

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
  >
    <View style={styles.customButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.text,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}
      >
        {TabArr.map((item, index) => {
          if (item.isCustom) {
            return (
              <Tabs.Screen
                key={index}
                name={item.route}
                options={{
                  tabBarLabel: () => null,
                  tabBarButton: (props) => <CustomTabBarButton {...props} />,
                  tabBarIcon: () => (
                    <Ionicons name={item.activeIcon} size={32} color={COLORS.white} />
                  ),
                }}
              />
            );
          } else {
            return (
              <Tabs.Screen
                key={index}
                name={item.route}
                options={{
                  title: item.label,
                  tabBarIcon: ({ color, size, focused }) => (
                    <AnimatedTabBarIcon
                      focused={focused}
                      color={color}
                      size={size}
                      activeIcon={item.activeIcon}
                      inActiveIcon={item.inActiveIcon}
                      IconComponent={item.type}
                    />
                  ),
                }}
              />
            );
          }
        })}
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00639B"
  },
  tabBar: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 15,
    height: 70,
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: -5,
  },
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
