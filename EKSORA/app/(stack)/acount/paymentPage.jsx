import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { COLORS } from "../../../constants/colors";


const paymentMethods = [
  { id: "momo", label: "MoMo E-Wallet" },
  { id: "atm", label: "ATM by MoMo", note: "Hoàn tiền không áp dụng cho lựa chọn thanh toán của bạn" },
  { id: "credit", label: "Thêm/Quản lý Thẻ tín dụng" },
  { id: "googlepay", label: "Google Pay" },
];

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { totalPrice } = useLocalSearchParams();
  const totalAmount = Number(totalPrice || 0);


  const bankIcons = {
    momo: "microsoft-xbox-controller-menu", // replaced with closer icon to MoMo wallet
    atm: "bank-outline", // outlined bank icon for ATM
    credit: "credit-card-outline", // outlined credit card icon
    googlepay: "google", // keep google icon
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.methodRow}
      onPress={() => setSelectedMethod(item.id)}
    >
      <View style={styles.methodInfo}>
        <MaterialCommunityIcons name={bankIcons[item.id]} size={24} color={COLORS.primary} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.methodLabel}>{item.label}</Text>
          {item.note && <Text style={styles.methodNote}>{item.note}</Text>}
        </View>
      </View>
      <View style={styles.radioCircle}>
        {selectedMethod === item.id && <View style={styles.selectedRb} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <Text style={styles.totalAmount}>
        {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
      </Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.dropdownText}>Thông tin đơn hàng</Text>
        <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={20} color={COLORS.white} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.discountButton}>
        <Text style={styles.discountButtonText}>Sử dụng ưu đãi thanh toán</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </TouchableOpacity>

      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.methodList}
      />

      <TouchableOpacity
        style={styles.payNowButton}
        onPress={() => router.push("/acount/SuccessScreen")} // 👈 chuyển sang trang thành công
      >
        <Text style={styles.payNowButtonText}>Thanh toán ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004080", // Darker shade for background
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 10,
  },
  totalAmount: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  dropdownText: {
    color: COLORS.white,
    fontSize: 16,
  },
  discountButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    alignSelf: "center",
  },
  discountButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginRight: 8,
  },
  methodList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 8,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  methodLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  methodNote: {
    fontSize: 12,
    color: COLORS.gray,
  },
  payNowButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    bottom: 10
  },
  payNowButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
