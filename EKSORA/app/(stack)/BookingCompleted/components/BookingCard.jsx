import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../../constants/colors";

const DetailRow = ({ iconName, label, value }) => (
  <View style={styles.detailRow}>
    <Ionicons name={iconName} size={18} color={COLORS.primary} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const BookingSummaryCard = ({
  image,
  title,
  travelDate,
  quantityAdult,
  quantityChild,
  totalPrice,
  voucherCode,
  discountAmount,
  originalPrice,
}) => (
  <View style={styles.card}>
    <View style={styles.contentWrapper}>
      <Text style={styles.cardTitle}>{title}</Text>

      <DetailRow
        key="ticket-type"
        iconName="ticket-outline"
        label="Loại vé"
        value="Vé tiêu chuẩn"
      />
      <DetailRow
        key="travel-date"
        iconName="calendar-outline"
        label="Ngày tham gia"
        value={travelDate}
      />
      <DetailRow
        key="adult-quantity"
        iconName="person-outline"
        label="Người lớn"
        value={`x ${quantityAdult}`}
      />
      {Number(quantityChild) > 0 && (
        <DetailRow
          key="child-quantity"
          iconName="body-outline"
          label="Trẻ em"
          value={`x ${quantityChild}`}
        />
      )}

      {/* Hiển thị thông tin voucher nếu có */}
      {voucherCode && (
        <DetailRow
          key="voucher-code"
          iconName="pricetag-outline"
          label="Mã ưu đãi"
          value={voucherCode}
        />
      )}

      <View style={styles.divider} />

      {/* Hiển thị giá gốc và chiết khấu nếu có voucher */}
      {voucherCode && originalPrice && discountAmount > 0 && (
        <>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>
              {Number(originalPrice).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.discountLabel}>Chiết khấu</Text>
            <Text style={styles.discountValue}>
              -
              {Number(discountAmount).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
          <View style={styles.divider} />
        </>
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalPriceText}>
          {Number(totalPrice).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    // Working...,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentWrapper: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#F4F5F7",
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "500",
  },
  discountLabel: {
    fontSize: 14,
    color: COLORS.success || "#4CAF50",
  },
  discountValue: {
    fontSize: 14,
    color: COLORS.success || "#4CAF50",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default BookingSummaryCard;
