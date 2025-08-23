import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Header() {
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
              name="sale"
              size={32}
              color="rgba(255, 255, 255, 0.8)"
            />
            <Text style={styles.subtitle}>Ưu đãi</Text>
          </View>

          {/* ---- Tiêu đề chính ---- */}
          <Text style={styles.title}>Dành cho bạn</Text>
        </LinearGradient>
      </View>
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
});
