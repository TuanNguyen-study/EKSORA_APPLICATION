import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useCart } from "../../../store/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import Toast from "react-native-toast-message";

export default function PaymentWebview() {
  const { checkoutUrl, needCreateBooking, paymentId } = useLocalSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  // State to prevent duplicate success handling
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false);
  const hasProcessedSuccess = useRef(false);
  const webViewRef = useRef(null);

  console.log(
    ">>> [PAYMENT_WEBVIEW] Starting payment webview for paymentId:",
    paymentId
  );

  // Function to cancel payment link - kept for potential manual use, but removed auto-triggers
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
        console.log(">>> [PAYMENT_WEBVIEW] Payment link canceled successfully");
      } else {
        // console.warn(
        //   ">>> [PAYMENT_WEBVIEW] Failed to cancel payment link:",
        //   response.statusText
        // );
      }
    } catch (error) {
      // console.error(
      //   ">>> [PAYMENT_WEBVIEW] Error cancelling payment link:",
      //   error
      // );
    }
  };

  // DISABLED: Handle cancel payment action - removed to prevent totalPrice reset issues
  // Auto-cancellation on back/swipe gestures was causing booking data to be lost
  /*
  const handleCancelPayment = async () => {
    // Show toast hỏi người dùng trước khi hủy
    Toast.show({
      type: "info", 
      text1: "Hủy thanh toán?",
      text2: "Vuốt sang phải hoặc bấm nút Back để xác nhận",
    });

    try {
      // ta xử lý trực tiếp (nếu chắc chắn hủy luôn)
      const currentPaymentId = await AsyncStorage.getItem("CURRENT_PAYMENT_ID");
      const pendingBookingId = await AsyncStorage.getItem("PENDING_BOOKING_ID");

      const paymentIdToCancel = paymentId || currentPaymentId || pendingBookingId;
      if (paymentIdToCancel) {
        await cancelPaymentLink(paymentIdToCancel);
        // Clean up stored payment IDs
        await AsyncStorage.removeItem("CURRENT_PAYMENT_ID");
        await AsyncStorage.removeItem("PENDING_BOOKING_ID");
      }

      Toast.show({
        type: "success",
        text1: "Đã hủy thanh toán",
      });

      router.replace("cancel");
    } catch (error) {
      console.error(">>> [PAYMENT_WEBVIEW] Error during cancellation:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể hủy thanh toán",
      });
      router.replace("cancel");
    }
  };
  */

  // Removed PanResponder swipe gesture cancellation to prevent totalPrice reset issues
  // Users can still cancel via webview interface if needed

  // Handle hardware back button on Android - Allow normal navigation
  useEffect(() => {
    // Removed automatic cancellation logic to prevent totalPrice reset issues
    console.log(
      ">>> [PAYMENT_WEBVIEW] Back button handler removed to preserve booking data"
    );
  }, []);

  if (!checkoutUrl) {
    return (
      <View>
        <Text>Không có link thanh toán</Text>
      </View>
    );
  }

  const handleSuccessPayment = async () => {
    // Prevent duplicate success handling
    if (isProcessingSuccess || hasProcessedSuccess.current) {
      // console.log(
      //   ">>> [PAYMENT_WEBVIEW] Success already processed, ignoring duplicate call"
      // );
      return;
    }

    // console.log(">>> [PAYMENT_WEBVIEW] Processing payment success...");
    setIsProcessingSuccess(true);
    hasProcessedSuccess.current = true;

    try {
      // Mark payment as processed immediately to prevent race conditions
      const processedKey = `PAYMENT_PROCESSED_${paymentId || "unknown"}`;
      const alreadyProcessed = await AsyncStorage.getItem(processedKey);

      if (alreadyProcessed) {
        // console.log(
        //   // ">>> [PAYMENT_WEBVIEW] Payment already processed in AsyncStorage, skipping"
        // );
        router.replace("return");
        return;
      }

      // Mark as processed
      await AsyncStorage.setItem(processedKey, "true");
      // console.log(">>> [PAYMENT_WEBVIEW] Marked payment as processed");

      // Clear giỏ hàng nếu thanh toán thành công từ giỏ hàng
      if (needCreateBooking === "true") {
        await clearCart();
        // console.log(
        //   ">>> [PAYMENT_WEBVIEW] Cleared cart after successful payment"
        // );
      }

      // Xóa tất cả payment IDs khỏi AsyncStorage vì đã thanh toán thành công
      await AsyncStorage.removeItem("PENDING_BOOKING_ID");
      await AsyncStorage.removeItem("CURRENT_PAYMENT_ID");
      // console.log(
      //   ">>> [PAYMENT_WEBVIEW] Removed payment IDs after successful payment"
      // );

      // Clean up the processed marker after a delay (to prevent immediate re-processing)
      setTimeout(async () => {
        try {
          await AsyncStorage.removeItem(processedKey);
          // console.log(">>> [PAYMENT_WEBVIEW] Cleaned up processed marker");
        } catch (error) {
          // console.error(
          //   ">>> [PAYMENT_WEBVIEW] Error cleaning up processed marker:",
          //   error
          // );
        }
      }, 5000); // 5 seconds delay

      // Navigate to success page
      router.replace("return");
    } catch (error) {
      // console.error(
      //   ">>> [PAYMENT_WEBVIEW] Error processing successful payment:",
      //   error
      // );
      // Reset processing state on error
      setIsProcessingSuccess(false);
      hasProcessedSuccess.current = false;

      // Still navigate to success page to avoid user confusion
      router.replace("return");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: checkoutUrl }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="blue" />}
        onNavigationStateChange={(nav) => {
          if (nav.url.includes("success")) {
            handleSuccessPayment();
          } else if (nav.url.includes("cancel")) {
            router.replace("cancel");
          }
        }}
      />
    </View>
  );
}
