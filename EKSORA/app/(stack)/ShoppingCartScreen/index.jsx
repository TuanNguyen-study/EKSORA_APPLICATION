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

const formatCurrency = (amount) => {
  return `đ ${amount?.toLocaleString('vi-VN') || '0'}`;
};

const ShoppingCartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);

  // Đồng bộ selectedIds khi cartItems thay đổi
  useEffect(() => {
    setSelectedIds(cartItems.map((item) => item.id) || []);
  }, [cartItems]);

  // Xử lý chọn/bỏ chọn sản phẩm
  const handleToggleSelect = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((itemId) => itemId !== id)
        : [...prevIds, id]
    );
  };

  // Xử lý xóa sản phẩm
  const handleDelete = (id) => {
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

  // Xử lý chỉnh sửa
  const handleEdit = (id) => {
    Alert.alert('Thông báo', `Chức năng sửa sản phẩm ${id} chưa được phát triển.`);
  };

  // Xử lý chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.id) || []);
    }
  };

  // Tính tổng giá và giảm giá
  const { total, totalDiscount } = useMemo(() => {
    return (cartItems || []).reduce(
      (acc, item) => {
        if (selectedIds.includes(item.id)) {
          acc.total += item.price || 0;
          acc.totalDiscount += (item.originalPrice || 0) - (item.price || 0);
        }
        return acc;
      },
      { total: 0, totalDiscount: 0 }
    );
  }, [cartItems, selectedIds]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng ({cartItems?.length || 0})</Text>
        <TouchableOpacity onPress={handleSelectAll}>
          <Text style={styles.headerActionText}>
            {selectedIds.length === (cartItems?.length || 0) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems || []}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={handleToggleSelect}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng ({selectedIds.length} Đơn vị)</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalPrice}>{formatCurrency(total)}</Text>
            {totalDiscount > 0 && (
              <Text style={styles.totalDiscount}>
                Giảm {formatCurrency(totalDiscount)}
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
          onPress={() => Alert.alert('Thông báo', 'Chức năng thanh toán đang phát triển.')}
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