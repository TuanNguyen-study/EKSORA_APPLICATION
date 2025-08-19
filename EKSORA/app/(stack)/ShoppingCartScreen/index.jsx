import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useCart } from "../../../store/CartContext";
import Toast from 'react-native-toast-message';
import CartItem from "./components/CartItem";

const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0 đ";
  return `${amount.toLocaleString("vi-VN")} đ`;
};

const ShoppingCartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(
    () => cartItems.map((item) => item.id) || []
  );

  const { total, totalDiscount } = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        if (selectedIds.includes(item.id)) {
          acc.total += item.price || 0;
          acc.totalDiscount += item.discount || 0;
        }
        return acc;
      },
      { total: 0, totalDiscount: 0 }
    );
  }, [cartItems, selectedIds]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((itemId) => itemId !== id)
        : [...prevIds, id]
    );
  };

  const handleDeleteItem = (idToDelete) => {
    Toast.show({
      type: 'info',
      text1: 'Xóa sản phẩm',
      text2: 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      onPress: () => {
        removeFromCart(idToDelete);
        setSelectedIds((prevIds) =>
          prevIds.filter((id) => id !== idToDelete)
        );
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Sản phẩm đã được xóa khỏi giỏ hàng'
        });
      },
      autoHide: false,
      visibilityTime: 5000,
      bottomOffset: 40,
    });
  };

  const handleSelectAll = () => {
    const allItemIds = cartItems.map((item) => item.id);
    if (selectedIds.length === allItemIds.length && allItemIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allItemIds);
    }
  };

  //  TẠO HÀM ĐIỀU HƯỚNG ĐẾN TRANG CHI TIẾT
  const handleNavigateToDetail = (item) => {
    // Đảm bảo rằng item và tour_id tồn tại trước khi điều hướng
    if (item && item.tour_id) {
      // Sử dụng đường dẫn đến trang chi tiết tour của bạn.
      // Ví dụ: '/tour-detail/[id]' hoặc '/tours/[id]'
      router.push(`/trip-detail/${item.tour_id}`);
    } else {
      console.error("Lỗi: Không tìm thấy tour_id để điều hướng.");
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể xem chi tiết tour này.'
      });
    }
  };

  const handleProceedToCheckout = async () => {
    if (isLoading) return;

    const selectedItems = cartItems.filter((item) =>
      selectedIds.includes(item.id)
    );

    if (selectedItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Chưa chọn sản phẩm',
        text2: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.'
      });
      return;
    }

    if (!loggedInUser || !loggedInUser.id) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.'
      });
      return;
    }

    setIsLoading(true);

    try {
      // THAY ĐỔI: Không tạo booking ở đây nữa, chỉ chuẩn bị dữ liệu
      const itemsForBooking = selectedItems.map((item) => {
        const [day, month, year] = item.travelDate.split("/");
        const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Calculate prices and quantities
        const quantity_nguoiLon = Number(item.adults) || 0;
        const quantity_treEm = Number(item.children) || 0;
        const price_nguoiLon = Number(item.originalAdultPrice) || 0;
        const price_treEm = Number(item.originalChildPrice) || 0;
        
        // Calculate total price for this item
        const itemTotalPrice = (quantity_nguoiLon * price_nguoiLon) + 
                             (quantity_treEm * price_treEm);

        return {
          travel_date: formattedDate,
          user_id: loggedInUser.id,
          tour_id: item.tour_id,
          quantity_nguoiLon,
          quantity_treEm,
          price_nguoiLon,
          price_treEm,
          totalPrice: itemTotalPrice,
          optionServices: (item.selectedOptions || []).map((option) => ({
            option_service_id: option.id || option.option_service_id,
          })),
          coin: 0,
          voucher_id: item.voucherId || null,
          discount: Number(item.discount) || 0,
          // Add required contact fields
          fullName: `${loggedInUser.lastName || ""} ${loggedInUser.firstName || ""}`.trim(),
          email: loggedInUser.email || "",
          phone: loggedInUser.phone || "",
        };
      });

      // Chuyển đến trang hoàn tất đơn hàng trước khi thanh toán
      router.push({
        pathname: "/(stack)/BookingCompleted",
        params: {
          items: JSON.stringify(itemsForBooking),
          totalPrice: total.toString(),
          isPendingBooking: "true",
          fromCart: "true", // Đánh dấu là từ giỏ hàng
          // Thêm thông tin người dùng để hiển thị
          lastName: loggedInUser.lastName || "",
          firstName: loggedInUser.firstName || "",
          email: loggedInUser.email || "",
          phone: loggedInUser.phone || "",
          buyerAddress: loggedInUser.address || "Chưa có địa chỉ",
        },
      });
    } catch (error) {
      console.error("Lỗi khi chuẩn bị đơn hàng:", error.message || error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: `Chuẩn bị đơn hàng thất bại: ${error.message || "Vui lòng thử lại."}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
        <TouchableOpacity onPress={handleSelectAll} disabled={isLoading}>
          <Text style={styles.headerActionText}>
            {selectedIds.length === cartItems.length && cartItems.length > 0
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          // TRUYỀN HÀM ĐIỀU HƯỚNG VÀO CARTITEM
          <CartItem
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={() => handleToggleSelect(item.id)}
            onDelete={() => handleDeleteItem(item.id)}
            // Prop mới để xử lý sự kiện nhấn vào item
            onPressItem={() => handleNavigateToDetail(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedIds}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>
            Tổng cộng ({selectedIds.length} sản phẩm)
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.totalPrice}>{formatCurrency(total)}</Text>
            {totalDiscount > 0 && (
              <Text style={styles.totalDiscount}>
                (Giảm {formatCurrency(totalDiscount)})
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (selectedIds.length === 0 || isLoading) &&
              styles.checkoutButtonDisabled,
          ]}
          disabled={selectedIds.length === 0 || isLoading}
          onPress={handleProceedToCheckout}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  headerActionText: { fontSize: 14, color: "#555" },
  listContent: { paddingBottom: 120 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#888" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  totalInfo: { flex: 1, marginRight: 12 },
  totalLabel: { fontSize: 14, color: "#666" },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },
  totalPrice: { fontSize: 20, fontWeight: "bold", color: "#00639B" },
  totalDiscount: { fontSize: 12, color: "#FF6F00", marginLeft: 8 },
  checkoutButton: {
    backgroundColor: "#00639B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  checkoutButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ShoppingCartScreen;