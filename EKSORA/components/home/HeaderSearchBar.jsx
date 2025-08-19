import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginRequestModal from "../LoginRequestModal";

const HeaderSearchBar = () => {
  const router = useRouter();
  const [isLoginModalVisible, setIsLoginModalVisible] = React.useState(false);

  // Hàm xử lý khi bấm vào giỏ hàng
  const handleCartPress = async () => {
    try {
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!userId) {
        // Nếu chưa đăng nhập, hiển thị LoginRequestModal
        setIsLoginModalVisible(true);
      } else {
        // Nếu đã đăng nhập, chuyển đến giỏ hàng
        router.push("/(stack)/ShoppingCartScreen");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      // Fallback: hiển thị modal nếu có lỗi
      setIsLoginModalVisible(true);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => router.push("/(stack)/search")}
      >
        <Ionicons
          name="search"
          size={20}
          color={COLORS.black}
          style={styles.searchIcon}
        />
        <Text style={styles.searchInput}>Tìm kiếm tour...</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
        <Ionicons name="cart-outline" size={26} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/(stack)/notification")}
      >
        <Ionicons name="notifications-outline" size={26} color={COLORS.white} />
      </TouchableOpacity>

      <LoginRequestModal
        isVisible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    //paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: "center",
    height: 42,
    borderWidth: 0.5,
    borderColor: COLORS.black,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#ccc",
    fontSize: 15,
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
});

export default HeaderSearchBar;
