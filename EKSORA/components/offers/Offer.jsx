import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVoucher } from "../../store/VoucherContext";
import CouponModal from "../../app/(stack)/Voucher/CouponModal";
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

  const handleSave = (id) => {
    saveVoucher(id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#00639B", "#0087CA"]}
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
                colors={["#00639B", "#0087CA"]}
                style={styles.codeBox}
              >
                <View style={styles.boxHeader}>
                  <Text style={styles.boxHeaderText}>{offer.title}</Text>
                </View>
                <View style={styles.boxBody}>
                  <Text style={styles.discount}>{offer.discount}</Text>
                  {/* <Text style={styles.condition}>{offer.condition}</Text> */}
                  {offer.expiry && (
                    <Text style={styles.condition}>
                      HSD: {formatDate(offer.expiry)}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSave(offer.id)}
                  >
                    <Text style={styles.buttonText}>{offer.buttonText}</Text>
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
    gap: 12,
    display: "flex",
    flexDirection: "column",
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
  buttonText: {
    color: "#005bac",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    width: "100%",
    borderWidth: 0.5,
  },
  noVoucherText: {
    color: COLORS.textGray,
    fontSize: 14,
    fontStyle: "italic",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardHeader: {
    height: 200,
    justifyContent: "space-between",
  },
});
