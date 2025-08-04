import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { COLORS } from "../../../constants/colors";

// --- IMPORT CÁC COMPONENT CON ---
import OrderSummaryCard from "./components/OrderSummaryCard";
import PaymentFooter from "./components/PaymentFooter";
import PaymentHeader from "./components/PaymentHeader";
import PaymentMethodItem from "./components/PaymentMethodItem";

// Dữ liệu phương thức thanh toán
const paymentMethods = [
  { id: "Payos", label: "Ví PayOS", icon: "wallet-outline" },
  { id: "momo_atm", label: "Thẻ ATM/Internet Banking", icon: "bank-outline" },
  { id: "credit_card", label: "Thẻ tín dụng/ghi nợ", icon: "credit-card-outline", note: "Visa, Mastercard, JCB" },
  { id: "google_pay", label: "Google Pay", icon: "google" },
];

// --- COMPONENT CHÍNH ---
export default function PaymentPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  // --- LOGIC VÀ STATE  ---
  const { displayItems, finalTotalPrice, orderDescription } = useMemo(() => {
    // TRƯỜNG HỢP 1: Dữ liệu từ Giỏ hàng
    if (params.items && typeof params.items === 'string') {
      try {
        const parsedItems = JSON.parse(params.items);
        return {
          displayItems: parsedItems,
          finalTotalPrice: Number(params.totalPrice),
          orderDescription: `Thanh toán cho ${parsedItems.length} tour du lịch`,
        };
      } catch (e) {
        console.error("Lỗi parse JSON từ giỏ hàng:", e);
        return { displayItems: [], finalTotalPrice: 0, orderDescription: 'Lỗi đơn hàng' };
      }
    }
    // TRƯỜNG HỢP 2: Dữ liệu từ Đặt ngay
    const singleItem = {
      id: params.bookingId,
      title: params.title,
      travelDate: params.travelDate,
      quantityAdult: params.quantityAdult,
      quantityChild: params.quantityChild,
    };
    return {
      displayItems: [singleItem], 
      finalTotalPrice: Number(params.totalPrice),
      orderDescription: `Thanh toán đơn hàng: ${params.title || 'Tour du lịch'}`,
    };
  }, [params]);

  useEffect(() => {
    if (!params.fullName || !params.email || !params.phone) {
        Alert.alert("Thiếu thông tin", "Không tìm thấy thông tin liên lạc. Vui lòng quay lại và thử lại.");
    }
  }, [params]);

  const handlePayment = async () => {
    if (!params.fullName || !params.email || !params.phone) {
      Alert.alert('Lỗi', 'Thiếu thông tin liên lạc. Vui lòng thử lại.');
      return;
    }
    const representativeBookingId = params.bookingId || displayItems[0]?.id;
    if (!representativeBookingId) {
        Alert.alert('Lỗi', 'Không tìm thấy mã đơn hàng.');
        return;
    }
    const payload = {
      amount: finalTotalPrice,
      description: orderDescription,
      buyerName: params.fullName,
      buyerEmail: params.email,
      buyerPhone: params.phone,
      booking_id: representativeBookingId,
    };
    console.log('>>> [PAYMENT] ĐANG GỬI PAYLOAD LÊN SERVER:', JSON.stringify(payload, null, 2));
    if (!payload.amount || payload.amount <= 0 || isNaN(payload.amount)) {
        Alert.alert('Lỗi Dữ Liệu', `Tổng tiền không hợp lệ: ${payload.amount}. Không thể tạo thanh toán.`);
        return;
    }
    await AsyncStorage.setItem("PENDING_BOOKING_ID", representativeBookingId.toString());
    try {
      const response = await fetch('http://160.250.246.76:3000/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseText = await response.text();
      console.log('>>> [PAYMENT] SERVER PHẢN HỒI:', responseText);
      const data = JSON.parse(responseText);
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Lỗi không xác định từ server.';
        throw new Error(errorMessage);
      }
      if (data.url) {
        router.push({
          pathname: "/acount/payment-webview",
          params: { checkoutUrl: data.url }
        });
      } else {
        throw new Error('Không nhận được URL thanh toán từ server.');
      }
    } catch (err) {
      Alert.alert('Lỗi tạo thanh toán', err.message);
    }
  };

  const contactInfo = {
    fullName: params.fullName,
    email: params.email,
    phone: params.phone,
  };

  // --- PHẦN RENDER GIAO DIỆN ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <PaymentHeader onBackPress={() => router.back()} styles={styles} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <OrderSummaryCard 
          items={displayItems} 
          contactInfo={contactInfo} 
          styles={styles} 
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chọn phương thức thanh toán</Text>
          <FlatList
            data={paymentMethods}
            renderItem={({ item }) => (
              <PaymentMethodItem
                item={item}
                isSelected={selectedMethod === item.id}
                onSelect={() => setSelectedMethod(item.id)}
                styles={styles}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      <PaymentFooter 
        totalAmount={finalTotalPrice} 
        onPayPress={handlePayment} 
        styles={styles}
      />
    </SafeAreaView>
  );
}

// --- STYLESHEET GIỮ NGUYÊN ---
const styles = StyleSheet.create({
  // --- Layout chung ---
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Để nội dung không bị footer che khuất
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerButton: {
    width: 40, // Đảm bảo nút back và khoảng trống bên phải có cùng kích thước
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '600',
  },

  // --- Card chung ---
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow cho Android
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  cardContent: {
    paddingTop: 16,
  },
  
  // --- Chi tiết trong Card Đơn hàng ---
  detailTitle: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  detailText: {
    color: '#495057',
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 16,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginVertical: 12,
    marginHorizontal: 8,
  },

  // --- Phương thức thanh toán ---
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  methodRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
  },
  methodIcon: {
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: '600',
  },
  methodNote: {
    color: '#6C757D',
    fontSize: 13,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CED4DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  // --- Footer ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Shadow cho Android
    elevation: 10,
  },
  footerTotalLabel: {
    color: '#6C757D',
    fontSize: 14,
  },
  footerTotalAmount: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
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