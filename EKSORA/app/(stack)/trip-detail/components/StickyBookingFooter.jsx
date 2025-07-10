import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../../constants/colors";

const StickyBookingFooter = ({
  priceInfo,
  eksoraPoints,
  onAddToCart,
  onBookNow,
  onEksoraPointsPress,
  tourName,
  selectedVoucher, // Nhận từ props
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(selectedVoucher);
    } else {
      router.push("/account/bookingScreen");
    }
  };

  const formatPrice = (price) => {
    const value = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(value)) return "0 đ";

    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    });
  };


  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom:
            insets.bottom > 0
              ? insets.bottom
              : Platform.OS === "ios"
                ? 20
                : 16,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        <View style={styles.topRow}>
          <View style={styles.priceContainer}>
            {selectedVoucher && (
              <Text style={styles.originalPrice}>
                {formatPrice(priceInfo?.original || priceInfo?.current)}
              </Text>
            )}
            <Text style={styles.finalPrice}>
              {formatPrice(priceInfo?.current)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.voucherButton}
            onPress={() => { /* Không cần mở modal nữa, vì đã xử lý trong ProductBasicInfo */ }}
          >
            <Text style={styles.voucherButtonText}>
              {selectedVoucher
                ? `Đã áp dụng: ${selectedVoucher.voucher_id.discount}%`
                : "Chọn Voucher"}
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.buttonBase, styles.addToCartButton]}
            onPress={onAddToCart}
          >
            <Text style={[styles.buttonTextBase, styles.addToCartButtonText]}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonBase, styles.bookNowButton]}
            onPress={handleBookNow}
          >
            <Text style={[styles.buttonTextBase, styles.bookNowButtonText]}>
              Đặt ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  addToCartButton: {
    backgroundColor: "#FF7E7E",
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
  },
  buttonTextBase: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addToCartButtonText: {
    color: COLORS.white,
  },
  bookNowButtonText: {
    color: COLORS.white,
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    flexShrink: 1,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },

});

export default StickyBookingFooter;
