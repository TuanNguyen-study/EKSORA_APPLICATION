import React, { useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

// --- CÁC HÀM HỖ TRỢ ---

/**
 * Định dạng một số thành chuỗi tiền tệ Việt Nam.
 * @param {number} value - Số tiền cần định dạng.
 * @returns {string} Chuỗi đã định dạng (ví dụ: "100,000đ").
 */
const formatCurrency = (value) => {
  if (typeof value !== "number") return "0đ";
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`;
};

// Component hiển thị một dòng chi tiết với icon, nhãn và giá trị.

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <MaterialCommunityIcons name={icon} size={24} color="#4A90E2" />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

// Component chính, hiển thị một thẻ vé/chuyến đi.

export default function TripItem({ item }) {
  const [isPaying, setIsPaying] = useState(false);

  // Lấy thông tin người dùng đã đăng nhập từ Redux store
  const loggedInUser = useSelector((state) => state.auth.user);

  // Trả về null nếu dữ liệu đầu vào không hợp lệ
  if (!item || !item.tour_id) {
    return null;
  }

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // Điều hướng đến màn hình chi tiết lịch trình gợi ý.

  const handlePressSchedule = () => {
    router.push({
      pathname: "/(stack)/ScheduleDetail",
      params: {
        tourName: item?.tour_id?.name,
        nguoiLon: item?.quantity_nguoiLon?.toString() || "1",
        treEm: item?.quantity_treEm?.toString() || "0",
        tourImages: JSON.stringify(item?.tour_id?.image || []),
        totalPrice: item?.totalPrice?.toString() || "0",
        cateID: item?.tour_id?.cateID,
        time: item?.tour_id?.opening_time,
        close: item?.tour_id?.closing_time,
        bookingData: JSON.stringify(item),
      },
    });
  };

  // Điều hướng đến màn hình chi tiết booking.

  const handleNavigateToDetail = () => {
    if (isPaying) return; // Không cho phép điều hướng khi đang xử lý thanh toán
    router.push(`/(stack)/BookingDetailScreen/${item._id}`);
  };

  // Xử lý khi người dùng nhấn "Thanh toán ngay" cho một vé đang chờ.

  const handlePayment = async () => {
    if (isPaying) return;

    if (!loggedInUser || !loggedInUser.id) {
      Toast.show({
        type: 'error',
        text1: 'Chưa đăng nhập',
        text2: 'Vui lòng đăng nhập để tiếp tục thanh toán.'
      });
      return;
    }

    setIsPaying(true);

    try {
      console.log("Chuẩn bị thanh toán cho booking đã có ID:", item._id);

      // Tạo một đối tượng item để truyền đi, đảm bảo cấu trúc nhất quán
      // với những gì màn hình BookingCompleted mong đợi.
      const checkoutItem = {
        id: item._id, // booking id
        name: item.tour_id.name,
        adults: item.quantity_nguoiLon,
        children: item.quantity_treEm,
        travelDate: new Date(item.travel_date).toLocaleDateString("vi-VN"),
        bookingId: item._id,
        price: item.totalPrice,
      };

      // Chuẩn bị các tham số để điều hướng đến màn hình thanh toán
      const checkoutParams = {
        totalPrice: item.totalPrice.toString(),
        items: JSON.stringify([checkoutItem]), // Luôn gửi dưới dạng một mảng
        bookingId: item._id,
        fullName:
          item.fullName || `${loggedInUser.lastName} ${loggedInUser.firstName}`,
        email: item.email || loggedInUser.email,
        phone: item.phone || loggedInUser.phone,
        buyerAddress: loggedInUser.address || "Chưa có địa chỉ",
        fromTicketPage: "true", // Flag để biết đây là booking từ trang vé
      };

      router.push({
        pathname: "/BookingCompleted",
        params: checkoutParams,
      });
    } catch (error) {
      console.error("Lỗi khi chuẩn bị thanh toán:", error);
      Toast.show({
        type: 'error',
        text1: 'Đã xảy ra lỗi',
        text2: 'Không thể tiến hành thanh toán. Vui lòng thử lại.'
      });
    } finally {
      setIsPaying(false);
    }
  };

  // --- CÁC BIẾN LOGIC CHO VIỆC RENDER ---

  const statusMap = {
    pending: {
      text: "ĐANG CHỜ XỬ LÝ",
      color: "#F5A623",
      icon: "clock-outline",
    },
    paid: { text: "VÉ HỢP LỆ", color: "#7ED321", icon: "check-circle-outline" },
  };

  const currentStatus = statusMap[item.status] || {
    text: "KHÔNG RÕ",
    color: "#9E9E9E",
    icon: "help-circle-outline",
  };
  const qrValue = item.order_code ? String(item.order_code) : String(item._id);

  return (
    <TouchableOpacity
      onPress={handleNavigateToDetail}
      style={styles.cardContainer}
      activeOpacity={0.8}
      disabled={isPaying}
    >
      {/* ===== PHẦN HEADER CỦA VÉ ===== */}
      <ImageBackground
        source={{ uri: item.tour_id.image?.[0] }}
        style={styles.cardHeader}
        imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons
              name={currentStatus.icon}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {isPaying ? "ĐANG XỬ LÝ..." : currentStatus.text}
            </Text>
          </View>
          <Text style={styles.tourName} numberOfLines={3}>
            {item.tour_id.name}
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* ===== PHẦN THÂN VÉ VỚI CÁC CHI TIẾT ===== */}
      <View style={styles.cardBody}>
        <View style={styles.detailsGrid}>
          <DetailItem
            icon="calendar-check"
            label="Ngày đi"
            value={new Date(item.travel_date).toLocaleDateString("vi-VN")}
          />
          <DetailItem
            icon="account-multiple"
            label="Số khách"
            value={`${item.quantity_nguoiLon} Lớn, ${item.quantity_treEm} Trẻ em`}
          />
          <DetailItem
            icon="calendar-plus"
            label="Ngày đặt"
            value={new Date(item.booking_date).toLocaleDateString("vi-VN")}
          />
          <DetailItem
            icon="cash-multiple"
            label="Tổng chi phí"
            value={formatCurrency(item.totalPrice)}
          />
        </View>

        <View style={styles.divider} />

        {/* ===== PHẦN CHÂN VÉ (ACTION & QR) ===== */}
        <View style={styles.cardFooter}>
          {item.status === "pending" ? (
            // TRƯỜNG HỢP PENDING: Nút "Thanh toán ngay" chiếm hết chiều rộng
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: currentStatus.color, marginRight: 0 },
                isPaying && styles.disabledButton,
              ]}
              onPress={handlePayment}
              disabled={isPaying}
            >
              <Text style={styles.actionButtonText}>
                {isPaying ? "Đang xử lý..." : "Thanh toán ngay"}
              </Text>
              <Ionicons name="card-outline" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            // TRƯỜNG HỢP KHÁC: Hiển thị nút "Gợi ý lịch trình" và mã QR
            <>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: currentStatus.color },
                ]}
                onPress={handlePressSchedule}
              >
                <Text style={styles.actionButtonText}>
                  Xem gợi ý lịch trình
                </Text>
                <Ionicons name="arrow-forward-circle" size={22} color="#fff" />
              </TouchableOpacity>

              <View style={styles.qrContainer}>
                <QRCode
                  value={qrValue}
                  size={70}
                  backgroundColor="transparent"
                />
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 12,
  },
  cardHeader: {
    height: 200,
    justifyContent: "space-between",
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  tourName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  cardBody: {
    padding: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: "#888",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  qrContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
});