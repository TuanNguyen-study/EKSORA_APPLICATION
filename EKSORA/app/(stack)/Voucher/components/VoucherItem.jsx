import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Bảng màu để dễ dàng tùy chỉnh ---
const COLORS = {
  primary: '#2a6ee4ff',      // Màu xanh dương chủ đạo
  primaryLight: '#E0F2FE', // Màu xanh dương nhạt cho nền
  white: '#FFFFFF',
  text: '#1F2937',        // Màu chữ chính (gần đen)
  textSecondary: '#6B7280',// Màu chữ phụ (xám)
  border: '#E5E7EB',      // Màu viền
  disabled: '#D1D5DB',    // Màu cho trạng thái vô hiệu hóa
  red: '#EF4444',
};

// --- Component VoucherItem được thiết kế lại ---
const VoucherItem = ({ voucherData, onAction, isSelected, isUsable }) => {
  // Tránh lỗi nếu không có dữ liệu
  if (!voucherData || !voucherData.voucher_id) {
    return null;
  }

  const { voucher_id: voucher } = voucherData;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `HSD: ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Thay đổi style của container nếu voucher không thể sử dụng
  const containerStyle = [
    styles.container,
    !isUsable && { backgroundColor: '#F3F4F6' },
  ];

  return (
    <View style={containerStyle}>
      {/* ===== Phần bên trái (Phần màu) ===== */}
      <View style={[styles.leftSide, !isUsable && { backgroundColor: COLORS.disabled }]}>
        <Ionicons name="pricetag" size={32} color={COLORS.white} />
        <Text style={styles.discountText}>GIẢM</Text>
        <Text style={styles.discountValue}>{voucher.discount}%</Text>
      </View>

      {/* ===== Đường cắt chấm bi trang trí ===== */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorCircleTop} />
        <View style={styles.separatorLine} />
        <View style={styles.separatorCircleBottom} />
      </View>

      {/* ===== Phần bên phải (Nội dung) ===== */}
      <View style={styles.rightSide} pointerEvents={isUsable ? 'auto' : 'none'}>
        <View style={{ opacity: isUsable ? 1 : 0.5 }}>
          <Text style={styles.conditionText} numberOfLines={2}>
            {voucher.condition || `Giảm ${voucher.discount}% cho mọi đơn hàng`}
          </Text>
          <Text style={styles.minOrderText}>
            Đơn tối thiểu {Number(voucher.min_order_value / 1000).toFixed(0)}K
          </Text>
          <Text style={styles.expiryText}>{formatDate(voucher.end_date)}</Text>
        </View>

        {/* Nút hành động chỉ hiển thị khi voucher có thể dùng */}
        {isUsable && (
          <TouchableOpacity
            style={[styles.actionButton, isSelected ? styles.selectedButton : styles.applyButton]}
            onPress={() => onAction(voucherData)}
          >
            <Text style={[styles.actionButtonText, isSelected ? styles.selectedButtonText : styles.applyButtonText]}>
              {isSelected ? 'Bỏ chọn' : 'Áp dụng'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 120, // Tăng chiều cao một chút
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Quan trọng để hiệu ứng cắt góc hoạt động
  },
  leftSide: {
    width: 100, // Chiều rộng của phần màu
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  discountValue: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  // --- Hiệu ứng đường cắt ---
  separatorContainer: {
    width: 1,
    height: '100%',
  },
  separatorLine: {
    position: 'absolute',
    left: -1,
    top: '10%',
    height: '80%',
    width: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  separatorCircleTop: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F9FAFB', // Phải khớp với màu nền của Modal
  },
  separatorCircleBottom: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F9FAFB', // Phải khớp với màu nền của Modal
  },
  // --- Phần nội dung bên phải ---
  rightSide: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between', // Đẩy nội dung ra xa nhau
  },
  conditionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  minOrderText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  expiryText: {
    fontSize: 12,
    color: COLORS.red,
    fontStyle: 'italic',
  },
  // --- Nút hành động ---
  actionButton: {
    position: 'absolute', // Đặt nút ở góc
    right: 12,
    bottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
  },
  selectedButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  applyButtonText: {
    color: COLORS.white,
  },
  selectedButtonText: {
    color: COLORS.primary,
  },
});

export default VoucherItem;