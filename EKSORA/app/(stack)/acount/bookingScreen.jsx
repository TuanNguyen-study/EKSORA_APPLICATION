import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router"; // Import useNavigation
import { getOrders, cancelOrder } from "../../../API/services/servicesBooking"; // Import cancelOrder
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../../constants/colors";

export default function BookingScreen() {
  const [orders, setOrders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const data = await getOrders(userId);
          setOrders(data);
        } else {
          console.warn("Không tìm thấy userId");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCancel = () => {
    setModalVisible(true);
  };

  const confirmCancel = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await cancelOrder(userId, selectedItems);
        const updatedOrders = orders.filter(
          (item) => !selectedItems.includes(item.id)
        );
        setOrders(updatedOrders);
        setSelectedItems([]);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Hủy đơn hàng thất bại:", error);
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  const handleViewDetails = (itemId) => {
    router.push(`/orders/${itemId}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleSelect(item.id)}
            >
              <Ionicons
                name={
                  selectedItems.includes(item.id)
                    ? "checkbox"
                    : "square-outline"
                }
                size={20}
                color={selectedItems.includes(item.id) ? "blue" : "gray"}
              />
              <View style={styles.orderInfo}>
                <Text style={styles.itemText}>
                  {item.title || "Đơn hàng #" + item.id}
                </Text>
                <Text style={styles.status}>{item.status || "Đang xử lý"}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handleViewDetails(item.id)}
            >
              <Text style={styles.detailsText}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

  
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.black },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  orderInfo: { marginLeft: 10 },
  itemText: { fontSize: 16, fontWeight: "500", color: COLORS.black },
  status: { fontSize: 12, color: "#666" },
  detailsButton: {
    backgroundColor: COLORS.primary,
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
  },
  detailsText: { color: COLORS.white, fontSize: 12, fontWeight: "bold" },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
    opacity: 0.5,
  },
  deleteText: { color: COLORS.white, fontWeight: "bold" },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  confirmText: { color: COLORS.white, fontWeight: "bold" },
 
});