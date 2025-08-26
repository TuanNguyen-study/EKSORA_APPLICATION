import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function Body() {
  const router = useRouter();

  return (
    <View style={styles.bodyContainer}>
      {/* Box 1 */}
      <View style={styles.box}>
        <TouchableOpacity
          style={styles.touchableItem}
          onPress={() => router.push("/MyOrder/MyBookingsScreen")}
        >
          <Ionicons
            name="receipt-outline"
            size={24}
            color={COLORS.textDark}
            style={styles.icon}
          />
          <Text style={styles.label}>Đơn hàng</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={COLORS.textGray}
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.touchableItem}
          onPress={() => router.push("/TourReview/ReviewScreen")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={COLORS.textDark}
            style={styles.icon}
          />
          <Text style={styles.label}>Đánh giá</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={COLORS.textGray}
          />
        </TouchableOpacity>
      </View>

      {/* Box 2 */}
      <View style={styles.box}>
        <TouchableOpacity
          style={styles.touchableItem}
          onPress={() => router.push("/MyOrder/HelpScreen")}
        >
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={COLORS.textDark}
            style={styles.icon}
          />
          <Text style={styles.label}>Trợ giúp</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={COLORS.textGray}
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.touchableItem}
          onPress={() => router.push("/(stack)/acount/settingScreen")}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.textDark}
            style={styles.icon}
          />
          <Text style={styles.label}>Cài đặt</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={COLORS.textGray}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    // để lộ gradient từ AccountScreen, chỉ phủ 1 lớp mờ nhẹ
    backgroundColor: "transparent",
  },
  box: {
    borderRadius: 12,
    backgroundColor: "#FFFFFFEE", // trắng hơi trong cho mềm trên nền gradient
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  touchableItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(58, 95, 200, 0.15)", 
    marginLeft: 16 + 24 + 15,
  },
});
