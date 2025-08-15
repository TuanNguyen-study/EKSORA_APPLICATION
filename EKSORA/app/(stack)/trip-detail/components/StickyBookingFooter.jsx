import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../../constants/colors";

// Hàm định dạng tiền tệ 
const formatPrice = (price) => {
  const value = typeof price === "number" ? price : parseFloat(price);
  if (isNaN(value)) return "0 đ";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const StickyBookingFooter = ({
  priceInfo,
  selectedVoucher,
  onBookNow, 
}) => {
  const insets = useSafeAreaInsets(); 

  return (
    <View
      style={[
        styles.outerContainer,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
      ]}
    >
      <View style={styles.innerContainer}>
        {/* --- Phần hiển thị giá bên trái --- */}
        <View style={styles.priceInfoContainer}>
          <Text style={styles.totalLabel}>Chỉ từ</Text>
          <View style={styles.priceRow}>
            {selectedVoucher && (
              <Text style={styles.originalPrice}>
                {formatPrice(priceInfo?.original || priceInfo?.current)}
              </Text>
            )}
            
            <Text
              style={styles.finalPrice}
              numberOfLines={1}             
              adjustsFontSizeToFit={true}   
            >
              {formatPrice(priceInfo?.current)}
            </Text>
          </View>
        </View>

        {/* --- Nút "Đặt ngay" nổi bật bên phải --- */}
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={onBookNow} 
        >
          <Text style={styles.bookNowButtonText}>
            Đặt ngay
          </Text>
        </TouchableOpacity>
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
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  priceInfoContainer: {
    flex: 1, 
    marginRight: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  bookNowButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StickyBookingFooter;