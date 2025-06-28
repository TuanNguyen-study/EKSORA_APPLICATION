import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ setFilterData }) {
  const [modalVisible, setModalVisible] = useState(false);

  const applyFilters = () => {
    setFilterData({});
    setModalVisible(false);
  };

  const clearFilters = () => {
    setFilterData({});
    setModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Yêu thích</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle-outline" size={30} color="#005c8b" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Bộ lọc</Text>

            {/* Các lựa chọn đã bị xoá ở đây */}

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={applyFilters}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#005c8b",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  clearButtonText: {
    color: "#333",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#0088dc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
