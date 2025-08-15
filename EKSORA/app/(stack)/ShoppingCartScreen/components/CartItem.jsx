import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../../../store/CartContext";

// --- HÀM TIỆN ÍCH ---
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0 đ";
  return `${amount.toLocaleString("vi-VN")} đ`;
};

// --- XÁC ĐỊNH NGÀY THÁNG ---
const formatDate = (dateString) => {
  if (!dateString) return "Không xác định";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không xác định";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Không xác định";
  }
};

// --- COMPONENT CON: QUANTITY SELECTOR ---
const QuantitySelector = ({ label, quantity, onUpdate, price }) => (
  <View style={styles.quantitySelector}>
    <View>
      <Text style={styles.quantityLabel}>{label}:</Text>
      {price > 0 && (
        <Text style={styles.priceText}>{formatCurrency(price)}</Text>
      )}
    </View>
    <View style={styles.quantityControls}>
      <TouchableOpacity
        onPress={() => onUpdate(-1)}
        style={styles.quantityButton}
      >
        <Ionicons name="remove-circle-outline" size={24} color="#555" />
      </TouchableOpacity>
      <Text style={styles.quantityValue}>{quantity}</Text>
      <TouchableOpacity
        onPress={() => onUpdate(1)}
        style={styles.quantityButton}
      >
        <Ionicons name="add-circle-outline" size={24} color="#00639B" />
      </TouchableOpacity>
    </View>
  </View>
);

// --- COMPONENT CHÍNH: CART ITEM ---
const CartItem = ({
  item,
  isSelected,
  onToggleSelect,
  onDelete,
  onPressItem,
}) => {
  const { updateCartItem } = useCart();

  if (!item) return null;

  const originalItemPrice =
    item.originalAdultPrice * item.adults +
    item.originalChildPrice * item.children;
  const hasDiscount = item.discount > 0;

  const handleUpdateQuantity = (type, amount) => {
    let newAdults =
      type === "adults" ? Math.max(1, item.adults + amount) : item.adults;
    let newChildren =
      type === "children" ? Math.max(0, item.children + amount) : item.children;
    const newTotalPrice =
      item.adultPrice * newAdults + item.childPrice * newChildren;
    updateCartItem(item.id, {
      adults: newAdults,
      children: newChildren,
      price: newTotalPrice,
    });
  };

  return (
    // BỌC TOÀN BỘ ITEM BẰNG TOUCHABLEOPACITY
    // activeOpacity={0.8} giúp hiệu ứng nhấn mượt hơn

    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={onPressItem}
      activeOpacity={0.8}
    >
      {/* Vẫn giữ View bên trong để quản lý layout và style dễ dàng */}
      <View style={styles.cardContent}>
        {/* Checkbox */}
        {/* e.stopPropagation() ngăn sự kiện nổi bọt, tránh việc nhấn checkbox cũng kích hoạt điều hướng */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleSelect(item.id);
          }}
          style={styles.checkboxContainer}
        >
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? "#00639B" : "#888"}
          />
        </TouchableOpacity>

        {/* Ảnh */}
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/80" }}
          style={styles.image}
        />

        {/* Thông tin */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name || "Tên tour không xác định"}
          </Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color="#555" />
            <Text style={styles.detailText}>Ngày đi: {item.travelDate}</Text>
          </View>

          <View style={styles.quantityContainer}>
            <QuantitySelector
              label="Người lớn"
              quantity={item.adults}
              price={item.adultPrice}
              onUpdate={(amount) => handleUpdateQuantity("adults", amount)}
            />
            {item.children > 0 && (
              <QuantitySelector
                label="Trẻ em"
                quantity={item.children}
                price={item.childPrice}
                onUpdate={(amount) => handleUpdateQuantity("children", amount)}
              />
            )}
          </View>

          {item.selectedOptions && item.selectedOptions.length > 0 && (
            <View style={styles.optionsContainer}>
              {item.selectedOptions.map((opt, index) => (
                <Text
                  key={`${opt.optionId || opt.id || index}`}
                  style={styles.optionText}
                  numberOfLines={1}
                >
                  + {opt.optionName}
                </Text>
              ))}
            </View>
          )}

          {hasDiscount && (
            <View style={styles.voucherInfoContainer}>
              <View style={styles.voucherRow}>
                <Ionicons name="pricetag-outline" size={14} color="#28A745" />
                <Text style={styles.voucherText} numberOfLines={1}>
                  Mã <Text style={styles.voucherCode}>{item.voucherCode}</Text>{" "}
                  giảm{" "}
                  <Text style={styles.voucherAmount}>
                    -{formatCurrency(item.discount)}
                  </Text>
                </Text>
              </View>
              <View style={styles.voucherRow}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.expiryText}>
                  Hạn dùng: {formatDate(item.end_date)}
                </Text>
              </View>
            </View>
          )}

          {/* Hiển thị giá tiền và nút xóa */}
          <View style={styles.footerRow}>
            <View style={styles.priceSection}>
              <Text style={styles.finalPrice}>
                {formatCurrency(item.price)}
              </Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  {formatCurrency(originalItemPrice)}
                </Text>
              )}
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={22} color="#D9534F" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Style cho wrapper để tạo khoảng cách giữa các item
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Style cho nội dung bên trong
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
  },
  checkboxContainer: {
    paddingRight: 12,
    paddingTop: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#EEE",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
  },
  quantityContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  quantitySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 4,
  },
  quantityValue: {
    fontSize: 15,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
    marginHorizontal: 8,
    color: "#333",
  },
  optionsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  optionText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 2,
  },
  voucherInfoContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "rgba(40, 167, 69, 0.1)",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#28A745",
  },
  voucherRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  voucherText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 6,
    flex: 1,
  },
  voucherCode: {
    fontWeight: "bold",
    color: "#1E8449",
  },
  voucherAmount: {
    fontWeight: "bold",
    color: "#D9534F",
  },
  expiryText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    fontStyle: "italic",
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 10,
  },
  priceSection: {
    alignItems: "flex-start",
  },
  finalPrice: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#D9534F",
  },
  originalPrice: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 4,
    marginLeft: 12,
  },
});

export default React.memo(CartItem);
