import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { 
  Alert, 
  FlatList, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  SafeAreaView 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/colors";

// Dữ liệu phương thức thanh toán
const paymentMethods = [
  { id: "Payos", label: "Ví PayOS", icon: "wallet-outline" },
  { id: "momo_atm", label: "Thẻ ATM/Internet Banking", icon: "bank-outline" },
  { id: "credit_card", label: "Thẻ tín dụng/ghi nợ", icon: "credit-card-outline", note: "Visa, Mastercard, JCB" },
  { id: "google_pay", label: "Google Pay", icon: "google" },
];


// 1. Header của màn hình
const PaymentHeader = ({ onBackPress }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
      <Ionicons name="arrow-back" size={24} color={COLORS.black} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Thanh toán</Text>
    <View style={styles.headerButton} />
  </View>
);

// 2. Card hiển thị thông tin đơn hàng 
const OrderSummaryCard = ({ params, profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, quantityAdult, quantityChild, totalPrice, travelDate } = params;
  const totalAmount = Number(totalPrice || 0);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={22} color={COLORS.primary} />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.cardContent}>
          <Text style={styles.detailTitle}>{title || 'Chi tiết đơn hàng'}</Text>
          <Text style={styles.detailText}>Ngày đi: {travelDate}</Text>
          <Text style={styles.detailText}>Số lượng: {quantityAdult} người lớn, {quantityChild} trẻ em</Text>
          <View style={styles.separator} />
          <Text style={styles.detailTitle}>Thông tin liên lạc</Text>
          <Text style={styles.detailText}>{profile?.lastName} {profile?.firstName}</Text>
          <Text style={styles.detailText}>{profile?.email}</Text>
          <Text style={styles.detailText}>{profile?.phone}</Text>
        </View>
      )}
    </View>
  );
};

// 3. Một dòng phương thức thanh toán
const PaymentMethodItem = ({ item, isSelected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.methodRow, isSelected && styles.methodRowSelected]} 
    onPress={onSelect}
  >
    <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.primary} style={styles.methodIcon} />
    <View style={styles.methodInfo}>
      <Text style={styles.methodLabel}>{item.label}</Text>
      {item.note && <Text style={styles.methodNote}>{item.note}</Text>}
    </View>
    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
      {isSelected && <Ionicons name="checkmark-sharp" size={14} color={COLORS.white} />}
    </View>
  </TouchableOpacity>
);

// 4. Footer cố định dưới màn hình
const PaymentFooter = ({ totalAmount, onPayPress }) => {
  const insets = useSafeAreaInsets(); 
  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
      <View>
        <Text style={styles.footerTotalLabel}>Tổng cộng</Text>
        <Text style={styles.footerTotalAmount}>
          {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </Text>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={onPayPress}>
        <Text style={styles.payButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};


// --- COMPONENT CHÍNH ---
export default function PaymentPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bookingId } = params;

  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id); 
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ AsyncStorage
    (async () => {
      const profStr = await AsyncStorage.getItem('USER_PROFILE');
      if (profStr) setProfile(JSON.parse(profStr));
    })();

    // Kiểm tra bookingId, nếu không có thì lấy từ PENDING
    if (!bookingId) {
      (async () => {
        const savedId = await AsyncStorage.getItem("PENDING_BOOKING_ID");
        if (savedId) params.bookingId = savedId;
        else Alert.alert("Lỗi", "Không tìm thấy mã booking. Vui lòng đặt lại.");
      })();
    }
  }, []);

  const totalAmount = Number(params.totalPrice || 0);

  const handlePayment = async () => {
    if (!profile || !bookingId) {
      Alert.alert('Lỗi', 'Thiếu thông tin đơn hàng hoặc người dùng. Vui lòng thử lại.');
      return;
    }

    const payload = {
      amount: totalAmount,
      description: `Thanh toán đơn hàng: ${params.title || 'Tour du lịch'}`,
      buyerName: `${profile.firstName} ${profile.lastName}`,
      buyerEmail: profile.email,
      buyerPhone: profile.phone,
      booking_id: bookingId,
    };
    
    await AsyncStorage.setItem("PENDING_BOOKING_ID", bookingId);

    try {
      const response = await fetch('http://160.250.246.76:3000/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi từ server');
      }

      if (data.url) {
        router.push({
          pathname: "/acount/payment-webview",
          params: { checkoutUrl: data.url }
        });
      } else {
        throw new Error('Không nhận được URL thanh toán.');
      }
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi khi tạo thanh toán.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PaymentHeader onBackPress={() => router.back()} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <OrderSummaryCard params={params} profile={profile} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chọn phương thức thanh toán</Text>
          <FlatList
            data={paymentMethods}
            renderItem={({ item }) => (
              <PaymentMethodItem
                item={item}
                isSelected={selectedMethod === item.id}
                onSelect={() => setSelectedMethod(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      <PaymentFooter totalAmount={totalAmount} onPayPress={handlePayment} />
    </SafeAreaView>
  );
}

// --- STYLESHEET  ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  cardContent: {
    paddingTop: 16,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  methodIcon: {
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  methodNote: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  footerTotalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});