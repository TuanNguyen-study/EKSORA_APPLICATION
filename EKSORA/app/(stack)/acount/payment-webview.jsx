import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Text,
  View,
  BackHandler,
  Alert,
  PanResponder,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useCart } from "../../../store/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";

export default function PaymentWebview() {
  const { checkoutUrl, needCreateBooking, paymentId } = useLocalSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  // State to prevent duplicate success handling
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false);
  const hasProcessedSuccess = useRef(false);
  const webViewRef = useRef(null);

  // Get screen width for swipe detection
  const screenWidth = Dimensions.get("window").width;
  const swipeThreshold = screenWidth * 0.25; // 25% of screen width
  const swipeVelocityThreshold = 0.3;

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
        console.log(
          ">>> [PAYMENT_WEBVIEW] Payment link cancelled successfully"
        );
      } else {
        console.warn(
          ">>> [PAYMENT_WEBVIEW] Failed to cancel payment link:",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        ">>> [PAYMENT_WEBVIEW] Error cancelling payment link:",
        error
      );
    }
  };

  // Handle cancel payment action
  const handleCancelPayment = async () => {
    Alert.alert(
      "Hủy thanh toán?",
      "Bạn có chắc chắn muốn hủy thanh toán và quay lại không?",
      [
        { text: "Tiếp tục thanh toán", style: "cancel", onPress: () => null },
        {
          text: "Hủy thanh toán",
          style: "destructive",
          onPress: async () => {
            try {
              // Try to cancel the current payment
              const currentPaymentId =
                await AsyncStorage.getItem("CURRENT_PAYMENT_ID");
              const pendingBookingId =
                await AsyncStorage.getItem("PENDING_BOOKING_ID");

              const paymentIdToCancel =
                paymentId || currentPaymentId || pendingBookingId;
              if (paymentIdToCancel) {
                await cancelPaymentLink(paymentIdToCancel);
                // Clean up stored payment IDs
                await AsyncStorage.removeItem("CURRENT_PAYMENT_ID");
                await AsyncStorage.removeItem("PENDING_BOOKING_ID");
              }
              router.replace("cancel");
            } catch (error) {
              console.error(
                ">>> [PAYMENT_WEBVIEW] Error during cancellation:",
                error
              );
              router.replace("cancel");
            }
          },
        },
      ]
    );
  };

  // PanResponder for swipe gesture detection
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only handle horizontal swipes that are significant
      const isHorizontalSwipe =
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      const isSignificantDistance = Math.abs(gestureState.dx) > 30;
      return isHorizontalSwipe && isSignificantDistance;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy, vx } = gestureState;
      console.log(
        ">>> [PAYMENT_WEBVIEW] Swipe ended - dx:",
        dx,
        "dy:",
        dy,
        "vx:",
        vx
      );

      // Check for left-to-right swipe (going back)
      const isRightSwipe = dx > 0;
      const hasMinimumDistance = Math.abs(dx) > swipeThreshold;
      const hasGoodVelocity = Math.abs(vx) > swipeVelocityThreshold;
      const isMainlyHorizontal = Math.abs(dy) < Math.abs(dx) * 0.5;

      if (
        isRightSwipe &&
        (hasMinimumDistance || hasGoodVelocity) &&
        isMainlyHorizontal
      ) {
        console.log(">>> [PAYMENT_WEBVIEW] Valid swipe back gesture detected");
        handleCancelPayment();
      }
    },
  });

  // Handle hardware back button on Android
  useEffect(() => {
    const backAction = () => {
      handleCancelPayment();
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [router]);

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
      console.log(
        ">>> [PAYMENT_WEBVIEW] Success already processed, ignoring duplicate call"
      );
      return;
    }

    console.log(">>> [PAYMENT_WEBVIEW] Processing payment success...");
    setIsProcessingSuccess(true);
    hasProcessedSuccess.current = true;

    try {
      // Mark payment as processed immediately to prevent race conditions
      const processedKey = `PAYMENT_PROCESSED_${paymentId || "unknown"}`;
      const alreadyProcessed = await AsyncStorage.getItem(processedKey);

      if (alreadyProcessed) {
        console.log(
          ">>> [PAYMENT_WEBVIEW] Payment already processed in AsyncStorage, skipping"
        );
        router.replace("return");
        return;
      }

      // Mark as processed
      await AsyncStorage.setItem(processedKey, "true");
      console.log(">>> [PAYMENT_WEBVIEW] Marked payment as processed");

      // Clear giỏ hàng nếu thanh toán thành công từ giỏ hàng
      if (needCreateBooking === "true") {
        await clearCart();
        console.log(
          ">>> [PAYMENT_WEBVIEW] Cleared cart after successful payment"
        );
      }

      // Xóa tất cả payment IDs khỏi AsyncStorage vì đã thanh toán thành công
      await AsyncStorage.removeItem("PENDING_BOOKING_ID");
      await AsyncStorage.removeItem("CURRENT_PAYMENT_ID");
      console.log(
        ">>> [PAYMENT_WEBVIEW] Removed payment IDs after successful payment"
      );

      // Clean up the processed marker after a delay (to prevent immediate re-processing)
      setTimeout(async () => {
        try {
          await AsyncStorage.removeItem(processedKey);
          console.log(">>> [PAYMENT_WEBVIEW] Cleaned up processed marker");
        } catch (error) {
          console.error(
            ">>> [PAYMENT_WEBVIEW] Error cleaning up processed marker:",
            error
          );
        }
      }, 5000); // 5 seconds delay

      // Navigate to success page
      router.replace("return");
    } catch (error) {
      console.error(
        ">>> [PAYMENT_WEBVIEW] Error processing successful payment:",
        error
      );
      // Reset processing state on error
      setIsProcessingSuccess(false);
      hasProcessedSuccess.current = false;

      // Still navigate to success page to avoid user confusion
      router.replace("return");
    }
  };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
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
