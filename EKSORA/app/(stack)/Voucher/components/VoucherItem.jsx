import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Hàm helper để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const VoucherItem = ({ voucherData, onApply }) => {
  if (!voucherData || !voucherData.voucher_id) {
    return null; 
  }

  const { code, discount, condition, end_date, min_order_value } = voucherData.voucher_id;

  // Hàm xử lý khi nhấn "Sử dụng"
  const handleApply = () => {
    if (onApply) {
      onApply(voucherData); 
    }
  };

  return (
    <View style={styles.card}>
      {/* Phần bên trái */}
      <View style={styles.leftContainer}>
        <View style={styles.appOnlyBadge}>
          <Text style={styles.appOnlyText}>Chỉ áp dụng trên ứng dụng</Text>
        </View>
        <Text style={styles.title}>{condition || 'Không có điều kiện'}</Text>
        <Text style={styles.code}>Mã ưu đãi: {code || 'Không có mã'}</Text>
        <Text style={styles.expiry}>Hết hạn: {formatDate(end_date)}</Text>
      </View>

      {/* Đường kẻ đứt */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>

      {/* Phần bên phải */}
      <View style={styles.rightContainer}>
        <Text style={styles.discountText}>Giảm {discount ? `${discount}%` : '0%'}</Text>
        {min_order_value > 0 && (
          <Text style={styles.minOrderText}>
            Đơn tối thiểu: {min_order_value.toLocaleString('vi-VN')} VND
          </Text>
        )}
        <TouchableOpacity style={styles.useButton} onPress={handleApply}>
          <Text style={styles.useButtonText}>Sử dụng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#0087CA',
    shadowColor: '#0087CA',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContainer: {
    flex: 2.5,
    padding: 16,
  },
  rightContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#FDEEDC',
    borderStyle: 'dashed',
  },
  dividerContainer: {

  },
  appOnlyBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  appOnlyText: {
    color: '#0087CA',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  code: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  expiry: {
    fontSize: 14,
    color: '#EF4444',
  },
  discountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0087CA',
    marginBottom: 4,
  },
  minOrderText: {
      fontSize: 11,
      color: '#6B7280',
      marginBottom: 12,
      textAlign: 'center',
  },
  useButton: {
    backgroundColor: '#0087CA',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  useButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default VoucherItem;