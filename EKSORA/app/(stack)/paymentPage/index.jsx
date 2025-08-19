import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../../../constants/colors";
import { createBooking } from "../../../API/services/booking";
import { useCart } from "../../../store/CartContext";

// --- IMPORT CÁC COMPONENT CON ---
import OrderSummaryCard from "./components/OrderSummaryCard";
import PaymentHeader from "./components/PaymentHeader";
import PaymentMethodItem from "./components/PaymentMethodItem";

// Dữ liệu phương thức thanh toán
const paymentMethods = [
  { id: "Payos", label: "Ví PayOS", icon: "wallet-outline" },
  { id: "ZaloPay", label: "Ví ZaloPay", icon: "bank-outline" },

];

// --- COMPONENT FOOTER  ---
const PaymentFooter = ({ totalAmount, onPayPress, isProcessing, styles }) => {
  return (
    <View style={styles.footerContainer}>
      {/* --- THAY ĐỔI: Thêm lưu ý không hoàn tiền --- */}
      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>
          Lưu ý: Thanh toán rồi bạn sẽ không thể hủy vé.
        </Text>
      </View>

      <View style={styles.footerContent}>
        <View>
          <Text style={styles.footerTotalLabel}>Tổng cộng</Text>
          <Text style={styles.footerTotalAmount}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalAmount)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={onPayPress}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? "Đang xử lý..." : "Thanh toán"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- COMPONENT CHÍNH ---
export default function PaymentPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const { clearCart } = useCart();

  // Mặc định chọn PayOS
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  const needCreateBooking = params.needCreateBooking === "true";

  // Get screen width for swipe detection
  const screenWidth = Dimensions.get("window").width;
  const swipeThreshold = screenWidth * 0.25; // 25% of screen width
  const swipeVelocityThreshold = 0.3; // Minimum velocity for swipe

  // PanResponder for swipe gesture detection
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only handle horizontal swipes that are significant
      const isHorizontalSwipe =
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      const isSignificantDistance = Math.abs(gestureState.dx) > 30;
      return isHorizontalSwipe && isSignificantDistance;
    },
    onPanResponderGrant: () => {
      // Gesture has started
      console.log(">>> [PAYMENT] Swipe gesture started");
    },
    onPanResponderMove: (evt, gestureState) => {
      // Track swipe movement - could add visual feedback here if needed
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy, vx } = gestureState;
      console.log(">>> [PAYMENT] Swipe ended - dx:", dx, "dy:", dy, "vx:", vx);

      // Check for left-to-right swipe (going back)
      const isRightSwipe = dx > 0;
      const hasMinimumDistance = Math.abs(dx) > swipeThreshold;
      const hasGoodVelocity = Math.abs(vx) > swipeVelocityThreshold;
      const isMainlyHorizontal = Math.abs(dy) < Math.abs(dx) * 0.5; // Y movement should be less than half of X

      if (
        isRightSwipe &&
        (hasMinimumDistance || hasGoodVelocity) &&
        isMainlyHorizontal
      ) {
        console.log(">>> [PAYMENT] Valid swipe back gesture detected");
        handleBackPress();
      }
    },
    onPanResponderTerminate: () => {
      // Gesture was terminated
      console.log(">>> [PAYMENT] Swipe gesture terminated");
    },
  });

  // Function to cancel payment link
  const cancelPaymentLink = async (paymentId) => {
    try {
      const response = await fetch(
        "http://160.250.246.76:3000/api/cancel-payment-link",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        }
      );

      if (response.ok) {
        console.log(">>> [PAYMENT] Payment link canceled successfully");
      } else {
        console.warn(
          ">>> [PAYMENT] Failed to cancel payment link:",
          response.statusText
        );
      }
    } catch (error) {
      console.error(">>> [PAYMENT] Error cancelling payment link:", error);
    }
  };

  // Handle back navigation with payment cancellation
  const handleBackPress = async () => {
    // If user is processing payment, show confirmation
    if (isProcessing) {
      Alert.alert(
        "Hủy thanh toán?",
        "Bạn có chắc chắn muốn hủy quá trình thanh toán hiện tại không?",
        [
          { text: "Tiếp tục thanh toán", style: "cancel" },
          {
            text: "Hủy thanh toán",
            style: "destructive",
            onPress: async () => {
              try {
                // Try to get the current payment ID to cancel it
                const currentPaymentId =
                  await AsyncStorage.getItem("CURRENT_PAYMENT_ID");
                const pendingBookingId =
                  await AsyncStorage.getItem("PENDING_BOOKING_ID");

                const paymentIdToCancel = currentPaymentId || pendingBookingId;
                if (paymentIdToCancel) {
                  await cancelPaymentLink(paymentIdToCancel);
                  // Clean up stored payment IDs
                  await AsyncStorage.removeItem("CURRENT_PAYMENT_ID");
                  await AsyncStorage.removeItem("PENDING_BOOKING_ID");
                }

                // Reset processing state and go back
                setIsProcessing(false);
                router.back();
              } catch (error) {
                console.error(
                  ">>> [PAYMENT] Error during cancellation:",
                  error
                );
                setIsProcessing(false);
                router.back();
              }
            },
          },
        ]
      );
      return;
    }

    // Normal back navigation
    router.back();
  };

  // --- LOGIC VÀ STATE  ---
  const { displayItems, finalTotalPrice, orderDescription } = useMemo(() => {
    // TRƯỜNG HỢP 1: Dữ liệu từ Giỏ hàng
    if (params.items && typeof params.items === "string") {
      try {
        const parsedItems = JSON.parse(params.items);
        return {
          displayItems: parsedItems,
          finalTotalPrice: Number(params.totalPrice),
          orderDescription: `EKSORA thanh toán`,
        };
      } catch (e) {
        console.error("Lỗi parse JSON từ giỏ hàng:", e);
        return {
          displayItems: [],
          finalTotalPrice: 0,
          orderDescription: "Lỗi đơn hàng",
        };
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
      orderDescription: `EKSORA thanh toán  '}`,
    }
  }, [params]);

  useEffect(() => {
    if (!params.fullName || !params.email || !params.phone) {
      Alert.alert(
        "Thiếu thông tin",
        "Không tìm thấy thông tin liên lạc. Vui lòng quay lại và thử lại."
      );
    }
  }, [params]);

  // --- THAY ĐỔI: Xử lý khi chọn phương thức thanh toán ---
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handlePayment = async () => {
    if (!params.fullName || !params.email || !params.phone) {
      Alert.alert("Lỗi", "Thiếu thông tin liên lạc. Vui lòng thử lại.");
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

    try {
      let endpoint = "";
      if (selectedMethod === "Payos") {
        endpoint = "http://160.250.246.76:3000/api/create-payment-link";
      } else if (selectedMethod === "ZaloPay") {
        endpoint = "http://160.250.246.76:3000/api/zalo-pay/create-order";
      }

      console.log(">>> [PAYMENT REQUEST] Endpoint:", endpoint);
      console.log(">>> [PAYMENT REQUEST] Payload:", payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(">>> [PAYMENT RESPONSE] Data:", data);

      // Gom tất cả các khả năng URL trả về (PayOS, ZaloPay)
      const checkoutUrl =
        data.url ||
        data.order_url ||
        data.zalo_url ||
        data.raw?.order_url;

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Lỗi không xác định từ server.');
      }

      if (checkoutUrl) {
        // 🚀 Luôn mở trong WebView cho cả PayOS & ZaloPay
        router.push({
          pathname: "/acount/payment-webview",
          params: { checkoutUrl },
        });
      } else {
        throw new Error("Không nhận được URL thanh toán từ server.");
      }
    } catch (err) {
      console.error(">>> [PAYMENT ERROR]:", err);
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
      <PaymentHeader onBackPress={handleBackPress} styles={styles} />
      <View style={styles.gestureContainer} {...panResponder.panHandlers}>
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
                  // --- THAY ĐỔI: Sử dụng hàm xử lý mới ---
                  onSelect={() => handleSelectMethod(item.id)}
                  styles={styles}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </View>
      <PaymentFooter
        totalAmount={finalTotalPrice}
        onPayPress={handlePayment}
        isProcessing={isProcessing}
        styles={styles}
      />
    </SafeAreaView>
  );
} // --- STYLESHEET ĐÃ CẬP NHẬT ---
const styles = StyleSheet.create({
  // --- Layout chung ---
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 150, // Tăng khoảng đệm dưới để footer không che nội dung
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: "600",
  },

  // --- Card chung ---
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
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
    fontWeight: "600",
    marginTop: 8,
  },
  detailText: {
    color: "#495057",
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginVertical: 16,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#F1F3F5",
    marginVertical: 12,
    marginHorizontal: 8,
  },

  // --- Phương thức thanh toán ---
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#DEE2E6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  methodRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(52, 152, 219, 0.05)",
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
    fontWeight: "600",
  },
  methodNote: {
    color: "#6C757D",
    fontSize: 13,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CED4DA",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  // --- Footer  ---
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 16, // Thêm padding cho các thiết bị không có safe area
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  warningContainer: {
    //alignItems: 'center',
    marginBottom: 10,
  },
  warningText: {
    color: "#D9534F", // Màu đỏ cảnh báo
    fontSize: 13,
    fontWeight: "600",
    fontStyle: "italic",
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTotalLabel: {
    color: "#6C757D",
    fontSize: 14,
  },
  footerTotalAmount: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  payButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
