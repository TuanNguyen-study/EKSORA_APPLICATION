import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../../store/CartContext'; 
import CartItem from './components/CartItem';

// Helper function để định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 đ';
  return `${amount.toLocaleString('vi-VN')} đ`;
};

const ShoppingCartScreen = () => {
  // Hooks
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);

  // Đồng bộ hóa các sản phẩm được chọn khi giỏ hàng thay đổi
  useEffect(() => {
    setSelectedIds(cartItems.map((item) => item.id) || []);
  }, [cartItems]);

  // Tính toán tổng tiền và tổng giảm giá của các sản phẩm được chọn
  const { total, totalDiscount } = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        if (selectedIds.includes(item.id)) {
          const price = item.price || 0;
          const originalPrice = item.originalPrice || price;
          acc.total += price;
          acc.totalDiscount += originalPrice - price;
        }
        return acc;
      },
      { total: 0, totalDiscount: 0 }
    );
  }, [cartItems, selectedIds]);

  // --- Các hàm xử lý sự kiện ---

  const handleToggleSelect = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((itemId) => itemId !== id)
        : [...prevIds, id]
    );
  };

  const handleDeleteItem = (id) => {
    Alert.alert(
      'Xóa sản phẩm',
      'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            removeFromCart(id);
            setSelectedIds((prevIds) => prevIds.filter((itemId) => itemId !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSelectAll = () => {
    const allItemIds = cartItems.map((item) => item.id);
    if (selectedIds.length === allItemIds.length) {
      setSelectedIds([]); // Bỏ chọn tất cả
    } else {
      setSelectedIds(allItemIds); // Chọn tất cả
    }
  };

  /**
   * Xử lý chính: Điều hướng đến màn hình hoàn tất đơn hàng.
   * Thu thập dữ liệu các sản phẩm đã chọn và truyền qua params.
   */
  const handleProceedToCheckout = () => {
    // 1. Lọc ra các sản phẩm đã được chọn.
    const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));

    // 2. Kiểm tra điều kiện trước khi điều hướng.
    if (selectedItems.length === 0) {
      Alert.alert('Chưa chọn sản phẩm', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    // 3. Điều hướng và truyền dữ liệu.
    // Dữ liệu phức tạp (mảng/object) phải được chuyển thành chuỗi JSON.
    router.push({
      pathname: '/acount/BookingCompleted', // <-- THAY BẰNG ĐƯỜNG DẪN MÀN HÌNH HOÀN TẤT ĐƠN HÀNG CỦA BẠN
      params: {
        totalPrice: total,
        items: JSON.stringify(selectedItems),
      },
    });
  };

  // --- Render Component ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
        <TouchableOpacity onPress={handleSelectAll}>
          <Text style={styles.headerActionText}>
            {selectedIds.length === cartItems.length && cartItems.length > 0
              ? 'Bỏ chọn tất cả'
              : 'Chọn tất cả'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={() => handleToggleSelect(item.id)}
            onDelete={() => handleDeleteItem(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          </View>
        }
      />

      {/* Footer chứa nút thanh toán */}
      <View style={styles.footer}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Tổng cộng ({selectedIds.length} sản phẩm)</Text>
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
            selectedIds.length === 0 && styles.checkoutButtonDisabled,
          ]}
          disabled={selectedIds.length === 0}
          onPress={handleProceedToCheckout}
        >
          <Text style={styles.checkoutButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerActionText: { fontSize: 14, color: '#555' },
  listContent: { paddingBottom: 150 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalRow: { flexDirection: 'row', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#666' },
  totalPrice: { fontSize: 20, fontWeight: 'bold' },
  totalDiscount: { fontSize: 12, color: '#FF6F00', marginLeft: 8 },
  checkoutButton: {
    backgroundColor: '#00639B',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#FFCBA4',
  },
  checkoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ShoppingCartScreen;