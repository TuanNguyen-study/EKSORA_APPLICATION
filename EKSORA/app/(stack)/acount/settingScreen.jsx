import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { getUser, updateUser } from "../../../API/services/servicesUser";
import { COLORS } from "../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser();
        setUserInfo(data);
      } catch {
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Settings data
  const settingsData = [
    { id: "1", name: "Cài đặt tài khoản", route: "/settings/account" },
    { id: "2", name: "Về Eksora", route: "/settings/about" },
    { id: "3", name: "Đăng xuất", route: "/logout" },
  ];

  // Memoized handlers
  const handlePress = useCallback(
    (item) => {
      if (item.route === "/logout") setModalVisible(true);
      else router.push(item.route);
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.replace("../login/loginEmail");
    } catch {
      setError("Đăng xuất thất bại");
    } finally {
      setModalVisible(false);
    }
  }, [router]);

  const handleCancel = useCallback(() => setModalVisible(false), []);

  const handleUpdateUser = useCallback(async (updatedInfo) => {
    try {
      await updateUser(updatedInfo);
      setUserInfo(updatedInfo);
    } catch {
      setError("Không thể cập nhật thông tin người dùng");
    }
  }, []);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  // Render content based on state
  const renderContent = () => {
    if (loading)
      return <ActivityIndicator size="large" color={COLORS.primary} />;
    // if (error) return <Text style={styles.error}>{error}</Text>;
    return (
      <FlatList
        data={settingsData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt</Text>
        <View style={{ width: 24 }} /> 
      </View>
      {renderContent()}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  header: { flexDirection: "row", alignItems: "center",justifyContent:"space-between", marginBottom: 16 },
  backButton: { padding: 4 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginLeft: 8,
  },
  list: { paddingBottom: 16 },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemContent: { flexDirection: "row", alignItems: "center" },
  itemText: { fontSize: 16, color: COLORS.black },
  error: { textAlign: "center", color: COLORS.red, marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
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
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  confirmButton: { backgroundColor: COLORS.primary },
  buttonText: { fontSize: 16, color: COLORS.gray },
  confirmButtonText: { color: COLORS.white },
});
