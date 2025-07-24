import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

// Component nhận vào props là `onBackPress` và `styles` từ component cha
const PaymentHeader = ({ onBackPress, styles }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
      <Ionicons name="arrow-back" size={24} color={COLORS.black} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Thanh toán</Text>
    <View style={styles.headerButton} />
  </View>
);

// Dùng React.memo để tối ưu, tránh render lại không cần thiết
export default React.memo(PaymentHeader);