import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVoucher } from "../../store/VoucherContext";
import CouponModal from "../../app/(stack)/Voucher/CouponModal";
import LoginRequestModal from "../LoginRequestModal";
import { COLORS } from "../../constants/colors";
const { width: screenWidth } = Dimensions.get("window");
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Không xác định";
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

export default function Offer() {
  const { coupons, saveVoucher } = useVoucher();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = React.useState(false);

  // Hàm xử lý khi bấm nút "Lưu" voucher
  const handleSaveVoucher = (offer) => {
    if (offer.requiresLogin && !offer.isSaved) {
      // Nếu cần đăng nhập và chưa lưu, hiển thị LoginRequestModal
      setIsLoginModalVisible(true);
    } else if (!offer.isSaved) {
      // Nếu đã đăng nhập, lưu voucher bình thường
      saveVoucher(offer.id);
    }
    // Nếu đã lưu rồi (offer.isSaved = true), button bị disabled nên không làm gì
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0087CA", "#0087CA"]}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <Text style={styles.header}>Ưu đãi đặc biệt</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {coupons.length > 0 ? (
          coupons.slice(0, 10).map((offer) => (
            <View key={offer.id} style={styles.cardWrapper}>
              <LinearGradient
                colors={["#5f889cff", "#0087CA"]}
                style={styles.codeBox}
              >
                <View style={styles.boxHeader}>
                  <Text style={styles.boxHeaderText}>{offer.title}</Text>
                </View>
                <View style={styles.boxBody}>
                  <Text style={styles.discount}>{offer.discount}</Text>
                  {offer.expiry && (
                    <Text style={styles.condition}>
                      HSD: {formatDate(offer.expiry)}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.button,
                      offer.isSaved
                        ? styles.savedButton
                        : offer.requiresLogin
                          ? styles.loginRequiredButton
                          : styles.defaultButton,
                    ]}
                    onPress={() => handleSaveVoucher(offer)}
                    disabled={offer.isSaved}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        offer.isSaved
                          ? styles.savedButtonText
                          : offer.requiresLogin
                            ? styles.loginRequiredButtonText
                            : styles.defaultButtonText,
                      ]}
                    >
                      {offer.isSaved ? "Đã lưu" : "Lưu"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))
        ) : (
          <Text style={styles.noVoucherText}>
            Hiện tại chưa có mã ưu đãi khả dụng
          </Text>
        )}
      </ScrollView>

      <CouponModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />

      <LoginRequestModal
        isVisible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  seeAll: {
    color: "white",
    fontSize: 14,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 12,
  },
  cardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  codeBox: {
    width: screenWidth * 0.3,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
  },
  boxHeader: {
    backgroundColor: "#0090d0",
    paddingVertical: 6,
    alignItems: "center",
  },
  boxHeaderText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  boxBody: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  discount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  condition: {
    fontSize: 12,
    color: "#e0f0ff",
    textAlign: "center",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    width: "100%",
    borderWidth: 0.5,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "white",
  },
  loginRequiredButton: {
    backgroundColor: "white", // Màu trắng để giống defaultButton
  },
  savedButton: {
    backgroundColor: COLORS.textLight,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  defaultButtonText: {
    color: "#005bac",
  },
  loginRequiredButtonText: {
    color: "#005bac", // Màu xanh để dễ đọc, giống defaultButtonText
  },
  savedButtonText: {
    color: COLORS.lightGray,
  },
  noVoucherText: {
    color: COLORS.textGray,
    fontSize: 14,
    fontStyle: "italic",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
