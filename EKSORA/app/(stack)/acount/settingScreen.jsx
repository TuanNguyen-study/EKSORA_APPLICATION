import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { getUser } from "../../../API/services/servicesUser";
import { COLORS } from "../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import hook `useVoucher` nếu bạn có VoucherContext
// import { useVoucher } from "../../../store/VoucherContext"; 

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  android: {
    elevation: 2,
  },
});

export default function SettingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Dòng này chỉ cần nếu bạn có VoucherContext và muốn dọn dẹp nó
  // const { handleLogout: clearVoucherState } = useVoucher();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Chỉ gọi API này nếu có token, nếu không thì không cần
        const token = await AsyncStorage.getItem("ACCESS_TOKEN");
        if (token) {
          await getUser();
        }
      } catch (err) {
        console.error("Không thể tải thông tin người dùng:", err);
        // Không cần setError ở đây vì màn hình vẫn hiển thị được
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const settingsData = [
    { id: "1", name: "Cài đặt tài khoản", route: "/(stack)/UpdateUser" },
    { id: "2", name: "Về Eksora", route: "/MyOrder/HelpScreen" },
    { id: "3", name: "Đăng xuất", route: "/logout" },
  ];

  const handlePress = useCallback(
    (item) => {
      if (item.route === "/logout") {
        setModalVisible(true);
      } else {
        router.push(item.route);
      }
    },
    [router]
  );

  // === HÀM ĐĂNG XUẤT ĐÃ ĐƯỢC CẬP NHẬT HOÀN CHỈNH ===
  const handleLogout = useCallback(async () => {
    try {
      // DANH SÁCH CÁC KEY CẦN XÓA KHI ĐĂNG XUẤT
      const keysToRemove = [
        "ACCESS_TOKEN",
        "USER_ID",
      ];

      // 1. Xóa tất cả các key đã định nghĩa khỏi AsyncStorage
      await AsyncStorage.multiRemove(keysToRemove);

      router.replace("/(stack)/login/loginEmail"); 

    } catch (e) {
      console.error("Đăng xuất thất bại:", e);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      // Đóng modal dù thành công hay thất bại
      setModalVisible(false);
    }
  }, [router]); // Bỏ clearVoucherState nếu không dùng

  const handleCancel = useCallback(() => setModalVisible(false), []);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  // --- CÁC HÀM RENDER ---
  const renderSection = (title, items) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={[styles.cardContainer, cardShadow]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              index !== items.length - 1 && styles.itemWithBorder,
            ]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator style={{marginTop: 50}} size="large" color={COLORS.primary} />;
    }
    return (
      <View>
        {renderSection("Cài đặt", [settingsData[0]])}
        {renderSection("Khác", [settingsData[1]])}
        <TouchableOpacity
          style={[styles.logoutContainer, cardShadow]}
          onPress={() => handlePress(settingsData[2])}
        >
          <Text style={styles.logoutText}>{settingsData[2].name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Cài đặt</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>

        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, cardShadow]}>
              <Text style={styles.modalText}>Bạn có chắc muốn đăng xuất?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleLogout}
                >
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background || "#F5F5F5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background || "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  backButton: { padding: 4 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: "500",
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  itemWithBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border || "#E0E0E0",
  },
  itemText: {
    fontSize: 16,
    color: COLORS.black,
  },
  logoutContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.red || "#FF3B30",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 6,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  confirmButtonText: {
    color: COLORS.white,
  },
});