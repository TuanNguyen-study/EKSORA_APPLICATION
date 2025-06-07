import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Header({ setFilterData }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const router = useRouter();

  const destinations = [
    "Halong",
    "TP Hồ Chí Minh",
    "Đà lạt",
    "Hà Nội",
    "Nha Trang",
    "Phú Quốc",
    "Bến Tre",
  ];
  const categories = ["Tour & Trải nghiệm", "Vé tham quan"];
  const times = [
    "Trong 7 ngày trước",
    "Trong 30 ngày trước",
    "Trong 6 tháng trước",
    "Trong 12 tháng trước",
    "Trong hơn 1 năm trước",
  ];

  const applyFilters = () => {
    setFilterData({
      selectedDestination,
      selectedCategory,
      selectedTime,
    });
    setModalVisible(false); 
  };

  const clearFilters = () => {
    setSelectedDestination(null);
    setSelectedCategory(null);
    setSelectedTime(null);
    setFilterData({
      selectedDestination: null,
      selectedCategory: null,
      selectedTime: null,
    });
    setModalVisible(false); 
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.editButton}
        
        onPress={ () => router.push("/(stack)/favorites/editFavouriScreen")}
      >
        <Ionicons name="create-outline" size={24} color="#005c8b" />
      </TouchableOpacity>
      <Text style={styles.title}>Yêu thích</Text>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            style={styles.filterIcon}
          />
          <Text style={styles.filterText}>Lọc theo điểm đến</Text>
        </TouchableOpacity>
      </View>

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

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Điểm đến</Text>
              <View style={styles.filterOptions}>
                {destinations.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterButton,
                      selectedDestination === item && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedDestination(item)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedDestination === item &&
                          styles.selectedButtonText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Danh mục</Text>
              <View style={styles.filterOptions}>
                {categories.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterButton,
                      selectedCategory === item && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedCategory === item && styles.selectedButtonText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Đã lưu vào Yêu thích</Text>
              <View style={styles.filterOptions}>
                {times.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterButton,
                      selectedTime === item && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedTime(item)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedTime === item && styles.selectedButtonText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={applyFilters}
              >
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
    backgroundColor: "#e0f0ff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
   editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#005c8b",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -30,
  },
  icon: {
    marginRight: 16,
  },
  filterRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    color: "#005c8b",
    fontSize: 14,
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
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: "#0088dc",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedButtonText: {
    color: "white",
    fontWeight: "bold",
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
  selectedLocationText: {
    marginTop: 10,
    fontSize: 14,
    color: "#005c8b",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
