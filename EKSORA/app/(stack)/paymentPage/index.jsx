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
  { id: "momo_atm", label: "Thẻ ATM/Internet Banking", icon: "bank-outline" },
  {
    id: "credit_card",
    label: "Thẻ tín dụng/ghi nợ",
    icon: "credit-card-outline",
    note: "Visa, Mastercard, JCB",
  },
  { id: "google_pay", label: "Google Pay", icon: "google" },
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
        console.log(">>> [PAYMENT] Payment link cancelled successfully");
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
          orderDescription: `Thanh toán cho ${parsedItems.length} tour du lịch`,
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
      orderDescription: `Thanh toán đơn hàng: ${params.title || "Tour du lịch"}`,
    };
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
    if (methodId !== "Payos") {
      Alert.alert(
        "Tính năng đang phát triển",
        "Phương thức này hiện chưa khả dụng. Vui lòng chọn thanh toán qua Ví PayOS."
      );
      // Không cho phép chọn phương thức khác
      return;
    }
    setSelectedMethod(methodId);
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    // --- THAY ĐỔI: Thêm một lớp kiểm tra an toàn trước khi thanh toán ---
    if (selectedMethod !== "Payos") {
      Alert.alert(
        "Chưa hỗ trợ",
        "Phương thức thanh toán này đang được phát triển. Vui lòng chọn Ví PayOS để tiếp tục."
      );
      return;
    }

    if (!params.fullName || !params.email || !params.phone) {
      Alert.alert("Lỗi", "Thiếu thông tin liên lạc. Vui lòng thử lại.");
      return;
    }

    setIsProcessing(true);

    try {
      let bookingIds = [];
      let representativeBookingId = params.bookingId || displayItems[0]?.id;

      // THAY ĐỔI: Kiểm tra booking đã tồn tại trong AsyncStorage
      const existingBookingId =
        await AsyncStorage.getItem("PENDING_BOOKING_ID");

      if (existingBookingId && !needCreateBooking) {
        // Nếu có booking ID đã tồn tại và không cần tạo booking mới (từ vé pending)
        representativeBookingId = existingBookingId;
        console.log(
          ">>> [PAYMENT_PAGE] Sử dụng lại booking ID đã tồn tại:",
          representativeBookingId
        );
      } else if (needCreateBooking) {
        // Kiểm tra xem có dữ liệu booking từ "Đặt ngay" không
        if (params.bookingData) {
          // TRƯỜNG HỢP MỚI: Tạo booking từ "Đặt ngay"
          console.log('>>> [PAYMENT_PAGE] Tạo booking từ luồng "Đặt ngay"');
          const bookingData = JSON.parse(params.bookingData);

          // Thêm thông tin liên lạc vào booking data
          bookingData.fullName = params.fullName;
          bookingData.email = params.email;
          bookingData.phone = params.phone;

          console.log(
            ">>> [PAYMENT_PAGE] Creating direct booking with data:",
            bookingData
          );
          const res = await createBooking(bookingData);
          const bookingId = res?.booking_id || res?.booking?._id;

          if (bookingId) {
            representativeBookingId = bookingId;
            bookingIds = [bookingId];

            // Lưu booking ID mới tạo vào AsyncStorage
            await AsyncStorage.setItem(
              "PENDING_BOOKING_ID",
              representativeBookingId.toString()
            );
            console.log(
              '>>> [PAYMENT_PAGE] Đã tạo booking từ "Đặt ngay":',
              representativeBookingId
            );
          }
        } else {
          // Tạo đơn hàng mới từ giỏ hàng (logic cũ)
          console.log(">>> [PAYMENT_PAGE] Tạo booking từ giỏ hàng");
          const items = JSON.parse(params.items);

          for (const item of items) {
            const bookingData = {
              user_id: item.user_id,
              tour_id: item.tour_id,
              travel_date: item.travel_date,
              quantity_nguoiLon: item.quantity_nguoiLon,
              quantity_treEm: item.quantity_treEm,
              price_nguoiLon: item.price_nguoiLon,
              price_treEm: item.price_treEm,
              optionServices: item.optionServices || [],
              coin: item.coin || 0,
              voucher_id: item.voucher_id || null,
              discount: item.discount || 0,
              fullName: params.fullName,
              email: params.email,
              phone: params.phone,
            };

            console.log("Creating booking with data:", bookingData);
            const res = await createBooking(bookingData);
            const bookingId = res?.booking_id || res?.booking?._id;
            if (bookingId) {
              bookingIds.push(bookingId);
            }
          }

          // Sử dụng booking đầu tiên làm representative
          representativeBookingId = bookingIds[0];
          // Lưu booking ID mới tạo vào AsyncStorage
          await AsyncStorage.setItem(
            "PENDING_BOOKING_ID",
            representativeBookingId.toString()
          );
        }
      }

      if (!representativeBookingId) {
        Alert.alert("Lỗi", "Không tìm thấy mã đơn hàng.");
        return;
      }

      const payload = {
        amount: finalTotalPrice,
        description: orderDescription,
        buyerName: params.fullName,
        buyerEmail: params.email,
        buyerPhone: params.phone,
        booking_id: representativeBookingId, // Sử dụng booking ID gốc
        transaction_id: `TXN_${representativeBookingId}_${Date.now()}`, // Thêm transaction_id duy nhất
      };

      console.log(
        ">>> [PAYMENT] PAYLOAD TRƯỚC KHI GỬI:",
        JSON.stringify(payload, null, 2)
      );

      // Validate payload trước khi gửi
      const validationErrors = [];
      if (!payload.amount || payload.amount <= 0 || isNaN(payload.amount)) {
        validationErrors.push(`Tổng tiền không hợp lệ: ${payload.amount}`);
      }
      if (!payload.buyerName || payload.buyerName.trim().length < 2) {
        validationErrors.push(
          `Tên người mua không hợp lệ: "${payload.buyerName}"`
        );
      }
      if (!payload.buyerEmail || !payload.buyerEmail.includes("@")) {
        validationErrors.push(`Email không hợp lệ: "${payload.buyerEmail}"`);
      }
      if (!payload.buyerPhone || payload.buyerPhone.length < 10) {
        validationErrors.push(
          `Số điện thoại không hợp lệ: "${payload.buyerPhone}"`
        );
      }
      if (!payload.booking_id) {
        validationErrors.push("Mã đơn hàng không hợp lệ");
      }
      if (!payload.description) {
        validationErrors.push("Mô tả đơn hàng không hợp lệ");
      }

      if (validationErrors.length > 0) {
        console.error(">>> [PAYMENT] Validation Errors:", validationErrors);
        Alert.alert(
          "Lỗi Dữ Liệu",
          `Dữ liệu không hợp lệ:\n${validationErrors.join("\n")}`
        );
        return;
      }

      // Chỉ lưu PENDING_BOOKING_ID nếu chưa có sẵn trong AsyncStorage
      if (!existingBookingId || needCreateBooking) {
        await AsyncStorage.setItem(
          "PENDING_BOOKING_ID",
          representativeBookingId.toString()
        );
      }

      // Tạo AbortController để có thể timeout request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout

      const response = await fetch(
        "http://160.250.246.76:3000/api/create-payment-link",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId); // Clear timeout nếu request thành công

      const responseText = await response.text();
      console.log(">>> [PAYMENT] SERVER PHẢN HỒI RAW:", responseText);
      console.log(">>> [PAYMENT] Response Status:", response.status);
      console.log(
        ">>> [PAYMENT] Response Headers:",
        JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)
      );

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(">>> [PAYMENT] Lỗi parse JSON response:", parseError);
        throw new Error(
          `Lỗi parse response từ server. Response: ${responseText.substring(0, 200)}...`
        );
      }

      console.log(
        ">>> [PAYMENT] SERVER PHẢN HỒI JSON:",
        JSON.stringify(data, null, 2)
      );

      if (!response.ok) {
        // Xử lý lỗi cụ thể cho trường hợp đơn hàng đã tồn tại hoặc ObjectId không hợp lệ
        if (
          data.error &&
          (data.error.includes("đã tồn tại") ||
            data.error.includes("Cast to ObjectId failed"))
        ) {
          console.log(
            ">>> [PAYMENT] Phát hiện lỗi duplicate hoặc ObjectId không hợp lệ"
          );

          // Xóa PENDING_BOOKING_ID để reset trạng thái
          await AsyncStorage.removeItem("PENDING_BOOKING_ID");
          console.log(">>> [PAYMENT] Đã xóa PENDING_BOOKING_ID để reset");

          Alert.alert(
            "Lỗi Thanh Toán",
            "Phiên thanh toán trước đó chưa hoàn tất. Vui lòng thử lại từ đầu.",
            [
              {
                text: "Thử lại",
                onPress: () => {
                  // Refresh lại trang để người dùng có thể thử lại từ đầu
                  setIsProcessing(false);
                  router.back();
                },
              },
            ]
          );
          return;
        }

        // Cải thiện thông báo lỗi với thông tin chi tiết hơn
        const errorMessage =
          data.message ||
          data.error ||
          data.details ||
          "Lỗi không xác định từ server.";
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data: data,
        };
        console.error(
          ">>> [PAYMENT] Chi tiết lỗi:",
          JSON.stringify(errorDetails, null, 2)
        );

        throw new Error(
          `Server trả về lỗi ${response.status}: ${errorMessage}`
        );
      }

      if (data.url) {
        // Store payment link info for potential cancellation
        if (data.paymentLinkId || data.id) {
          await AsyncStorage.setItem(
            "CURRENT_PAYMENT_ID",
            data.paymentLinkId || data.id
          );
        }

        router.push({
          pathname: "/acount/payment-webview",
          params: {
            checkoutUrl: data.url,
            needCreateBooking: needCreateBooking, // Pass flag để clear cart
            paymentId: data.paymentLinkId || data.id || representativeBookingId, // Pass payment ID
          },
        });
      } else {
        throw new Error("Không nhận được URL thanh toán từ server.");
      }
    } catch (error) {
      console.error(">>> [PAYMENT] Lỗi trong quá trình thanh toán:", error);
      console.error(">>> [PAYMENT] Stack trace:", error.stack);

      // Kiểm tra loại lỗi để đưa ra thông báo phù hợp
      let userMessage = "Không thể xử lý thanh toán. Vui lòng thử lại.";
      let shouldResetBooking = false;

      if (error.name === "AbortError") {
        userMessage =
          "Yêu cầu thanh toán bị timeout. Vui lòng kiểm tra kết nối và thử lại.";
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        userMessage =
          "Không thể kết nối đến server thanh toán. Vui lòng kiểm tra kết nối internet và thử lại.";
      } else if (error.message.includes("parse")) {
        userMessage =
          "Server trả về dữ liệu không hợp lệ. Vui lòng thử lại sau.";
      } else if (error.message.includes("Server trả về lỗi")) {
        userMessage = error.message; // Sử dụng message chi tiết từ server
        // Nếu là lỗi server 500, có thể cần reset booking
        if (error.message.includes("500")) {
          shouldResetBooking = true;
        }
      }

      // Reset booking nếu cần
      if (shouldResetBooking) {
        try {
          await AsyncStorage.removeItem("PENDING_BOOKING_ID");
          console.log(
            ">>> [PAYMENT] Đã reset PENDING_BOOKING_ID do lỗi server"
          );
          userMessage +=
            "\n\nTrạng thái thanh toán đã được reset. Vui lòng thử lại từ đầu.";
        } catch (resetError) {
          console.error(">>> [PAYMENT] Lỗi khi reset booking:", resetError);
        }
      }

      Alert.alert("Lỗi Thanh Toán", userMessage);
    } finally {
      setIsProcessing(false);
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
