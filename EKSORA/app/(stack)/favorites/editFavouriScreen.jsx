import React, { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import { getFavorites } from "../../../API/services/servicesFavorite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteFavorites } from "../../../API/services/servicesFavorite";


export default function EditFavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();



  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const data = await getFavorites(userId);
          setFavorites(data);
        } else {
          console.warn("Không tìm thấy userId");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDelete = () => {
    setModalVisible(true);
  };

const confirmDelete = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      await deleteFavorites(userId, selectedItems);
      const updatedData = favorites.filter(
        (item) => !selectedItems.includes(item.id)
      );
      setFavorites(updatedData);
      setSelectedItems([]);
      setModalVisible(false);
    }
  } catch (error) {
    console.error("Xoá thất bại:", error);
  }
};

  const cancelDelete = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Favorites</Text>

      <FlatList
        data={favorites}
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
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.back()}
        >
          <Text style={styles.confirmText}>Done</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete selected items?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelDelete}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  itemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  itemText: { marginLeft: 10 },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  deleteText: { color: "white", fontWeight: "bold" },
  confirmButton: {
    backgroundColor: "#0088dc",
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  confirmText: { color: "white", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, marginBottom: 20 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#0088dc",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: { color: "white", fontWeight: "bold" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
