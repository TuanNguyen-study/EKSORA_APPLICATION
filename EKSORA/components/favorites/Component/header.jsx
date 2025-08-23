import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity ,SafeAreaView,Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    <SafeAreaView style={styles.safeArea}>
      <View>
        <LinearGradient
         colors={["#2a6ee4ff", "#2a6ee4ff", "#0087CA"]}
          locations={[0, 0.3, 0.7, 0,9]}
          style={styles.headerContainer}
        >
          {/* ---- Nhóm các thành phần phụ ---- */}
          <View style={styles.subtitleContainer}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={32}
              color="rgba(255, 255, 255, 0.8)"
            />
          <Text style={styles.title}>Yêu thích</Text>

          </View>

        </LinearGradient>
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
    {/* </View> */}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: "#ffffff",
      zIndex: 1000, // Đảm bảo header luôn ở trên cùng
    },
    headerContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: Platform.OS === "android" ? 40 : 20,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 10,
    },
    subtitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      marginLeft: 8,
      fontWeight: "500",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#ffffff",
      textShadowColor: "rgba(0, 0, 0, 0.15)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
  header: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
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
    backgroundColor: "#2a6ee4ff",
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
