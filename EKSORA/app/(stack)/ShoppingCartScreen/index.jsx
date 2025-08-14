// ShoppingCartScreen.js

import React, { useState, useMemo } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../../store/CartContext';
import CartItem from './components/CartItem';
import { createBooking } from '../../../API/services/booking';
import { useSelector } from 'react-redux';

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 đ';
  return `${amount.toLocaleString('vi-VN')} đ`;
};

const ShoppingCartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() =>
    cartItems.map((item) => item.id) || []
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
    Alert.alert(
      'Xóa sản phẩm',
      'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            removeFromCart(idToDelete);
            setSelectedIds((prevIds) => prevIds.filter((id) => id !== idToDelete));
          },
          style: 'destructive',
        },
      ]
    );
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
      Alert.alert('Lỗi', 'Không thể xem chi tiết tour này.');
    }
  };


  const handleProceedToCheckout = async () => {
    if (isLoading) return;

    const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));

    if (selectedItems.length === 0) {
      Alert.alert('Chưa chọn sản phẩm', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    if (!loggedInUser || !loggedInUser.id) {
      Alert.alert('Lỗi', 'Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.');
      return;
    }

    setIsLoading(true);

    try {
      const createdItems = [];

      for (const item of selectedItems) {
        const [day, month, year] = item.travelDate.split('/');
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const bookingData = {
          user_id: loggedInUser.id,
          tour_id: item.tour_id,
          travel_date: formattedDate,
          quantity_nguoiLon: item.adults,
          quantity_treEm: item.children,
          price_nguoiLon: item.originalAdultPrice,
          price_treEm: item.originalChildPrice,
          optionServices: (item.selectedOptions || []).map((option) => ({
            option_service_id: option.id || option.option_service_id,
          })),
          coin: 0,
          voucher_id: item.voucherId || null,
          discount: item.discount || 0,
          fullName: `${loggedInUser.lastName} ${loggedInUser.firstName}`,
          email: loggedInUser.email,
          phone: loggedInUser.phone,
        };

        const res = await createBooking(bookingData);
        const individualBookingId = res?.booking_id || res?.booking?._id;
        const bookingStatus = res?.status || 'pending';

        if (!individualBookingId) throw new Error(`Không tạo được booking cho tour: ${item.name}`);

        createdItems.push({ ...item, bookingId: individualBookingId, status: bookingStatus });
      }

      if (createdItems.length === 0) throw new Error('Không có đơn hàng nào được tạo thành công.');

      const representativeBookingId = createdItems[0].bookingId;
      const checkoutParams = {
        totalPrice: total.toString(),
        items: JSON.stringify(createdItems),
        bookingId: representativeBookingId,
        fullName: `${loggedInUser.lastName} ${loggedInUser.firstName}`,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        buyerAddress: loggedInUser.address || 'Chưa có địa chỉ',
      };

      router.push({
        pathname: '/BookingCompleted',
        params: checkoutParams,
      });

    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error.message || error);
      Alert.alert('Lỗi', `Đặt tour thất bại: ${error.message || 'Vui lòng thử lại.'}`);
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
              ? 'Bỏ chọn tất cả'
              : 'Chọn tất cả'}
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
            (selectedIds.length === 0 || isLoading) && styles.checkoutButtonDisabled,
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerActionText: { fontSize: 14, color: '#555' },
  listContent: { paddingBottom: 120 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalInfo: { flex: 1, marginRight: 12 },
  totalLabel: { fontSize: 14, color: '#666' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#00639B' },
  totalDiscount: { fontSize: 12, color: '#FF6F00', marginLeft: 8 },
  checkoutButton: {
    backgroundColor: '#00639B',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  checkoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ShoppingCartScreen;