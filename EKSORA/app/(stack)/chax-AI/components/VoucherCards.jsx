import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

// Component hiển thị một voucher
const SimpleVoucherCard = ({
  voucher,
  onSave,
  userInfo,
  isSaving = false,
  style,
  isLoggedIn = false, // ✨ NEW: Add isLoggedIn prop
  onLoginRequired // ✨ NEW: Add callback for login required
}) => {
  const normalizeVoucher = (v) => {
    let discount = v.discount || v.value || v.discountValue || 0;
    let discountType = v.discountType || 'fixed';

    if (typeof discount === 'string') {
      if (discount.includes('%')) {
        discountType = 'percentage';
        discount = parseInt(discount.replace(/[^\d]/g, ''));
      } else {
        discount = parseInt(discount.replace(/[^\d]/g, ''));
      }
    }

    return {
      id: v.id || v._id || v.voucherId,
      code: v.code || v.ma || v.voucher_code || v.voucherCode || 'NOCODE',
      discount: discount,
      discountType: discountType,
      expiryDate: v.expiryDate || v.expiredAt || v.expiry || v.endDate,
      title:
        v.title ||
        v.name ||
        v.voucherName ||
        v.description ||
        'Ứng dụng cho tour du lịch hè',
      description: v.description || v.desc || v.details || '',
      minOrderAmount: v.minOrderAmount || v.minOrder || v.minAmount || 0,
      maxDiscount: v.maxDiscount || v.maxValue,
      usageLimit: v.usageLimit || v.limit,
      usageCount: v.usageCount || v.used || 0,
      isActive: v.isActive !== false,
      ...v
    };
  };

  const normalizedVoucher = normalizeVoucher(voucher);

  const formatDiscount = (discount, discountType) => {
    if (!discount || discount === 0) return '0%';

    if (discountType === 'percentage') {
      return `${discount}%`;
    } else {
      const numDiscount =
        typeof discount === 'string'
          ? parseInt(discount.replace(/[^\d]/g, ''))
          : discount;

      if (numDiscount >= 1000000) {
        const millions = numDiscount / 1000000;
        return millions % 1 === 0
          ? `${millions} triệu đ`
          : `${millions.toFixed(1)} triệu đ`;
      } else if (numDiscount >= 1000) {
        return `${(numDiscount / 1000).toFixed(0)}k đ`;
      }
      return `${numDiscount} đ`;
    }
  };

  const formatExpiryDate = (date) => {
    if (!date) return 'Không thời hạn';

    try {
      const expiryDate = new Date(date);
      return expiryDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Không xác định';
    }
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // ✨ UPDATED: Handle save with login check
  const handleSave = async () => {
    // ✨ NEW: Check login status first
    if (!isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để lưu mã ưu đãi',
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Đăng nhập', 
            onPress: () => onLoginRequired?.()
          }
        ]
      );
      return;
    }

    if (isExpired(normalizedVoucher.expiryDate)) {
      Alert.alert('Không thể lưu', 'Voucher này đã hết hạn sử dụng.');
      return;
    }

    try {
      if (onSave) {
        await onSave(normalizedVoucher);
      }
      Alert.alert('Đã lưu', 'Voucher đã được lưu vào tài khoản của bạn!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu voucher. Vui lòng thử lại.');
    }
  };

  // ✨ NEW: Handle voucher code view with login check
  const handleViewCode = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để xem mã ưu đãi',
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Đăng nhập', 
            onPress: () => onLoginRequired?.()
          }
        ]
      );
      return;
    }

    // Show voucher code if logged in
    Alert.alert(
      'Mã ưu đãi',
      `Mã: ${normalizedVoucher.code}\n\nBạn có muốn sao chép mã này?`,
      [
        { text: 'Đóng', style: 'cancel' },
        { 
          text: 'Sao chép',
          onPress: () => {
            // Here you can implement copy to clipboard
            Alert.alert('Đã sao chép', `Mã "${normalizedVoucher.code}" đã được sao chép!`);
          }
        }
      ]
    );
  };

  return (
    <View
      style={[
        styles.card,
        style,
        isExpired(normalizedVoucher.expiryDate) && styles.expiredCard
      ]}
    >
      {/* Góc tam giác xanh */}
      <View style={styles.cornerTriangle} />

      {/* Nội dung chính */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isExpired(normalizedVoucher.expiryDate) && styles.expiredText
          ]}
          numberOfLines={2}
        >
          {normalizedVoucher.title}
        </Text>

        <Text
          style={[
            styles.discountText,
            isExpired(normalizedVoucher.expiryDate) && styles.expiredText
          ]}
        >
          Giảm giá {formatDiscount(normalizedVoucher.discount, normalizedVoucher.discountType)}
        </Text>

        {/* ✨ UPDATED: Make voucher code clickable with login check */}
        <TouchableOpacity onPress={handleViewCode}>
          <Text
            style={[
              styles.voucherCode,
              isExpired(normalizedVoucher.expiryDate) && styles.expiredText,
              !isLoggedIn && styles.hiddenCode // ✨ NEW: Style for hidden code
            ]}
          >
            {isLoggedIn ? `Mã: ${normalizedVoucher.code}` : 'Mã: ••••••••'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.expiryText,
              isExpired(normalizedVoucher.expiryDate) && styles.expiredText
            ]}
          >
            Hết hạn: {formatExpiryDate(normalizedVoucher.expiryDate)}
          </Text>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (isSaving || isExpired(normalizedVoucher.expiryDate)) &&
                styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={isSaving || isExpired(normalizedVoucher.expiryDate)}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Component hiển thị danh sách vouchers ngang
export default function VoucherCards({
  vouchers,
  onVoucherPress,
  onVoucherSave,
  userInfo,
  savingVoucherId,
  isLoggedIn = false, // ✨ NEW: Add isLoggedIn prop
  onLoginRequired // ✨ NEW: Add login callback
}) {
  if (!vouchers || vouchers.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8 }}
    >
      {vouchers.map((v) => (
        <SimpleVoucherCard
          key={v.id || v._id || v.voucherId}
          voucher={v}
          onSave={onVoucherSave}
          userInfo={userInfo}
          isSaving={savingVoucherId === (v.id || v._id || v.voucherId)}
          style={{ width: width * 0.6, marginHorizontal: 8 }}
          isLoggedIn={isLoggedIn} // ✨ NEW: Pass login status
          onLoginRequired={onLoginRequired} // ✨ NEW: Pass login callback
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
    minHeight: 100,
  },
  expiredCard: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8',
    borderColor: '#ccc'
  },
  cornerTriangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '#2196F3',
    borderRightWidth: 40,
    borderRightColor: 'transparent'
  },
  content: {
    paddingTop: 8,
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22
  },
  discountText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    marginBottom: 6
  },
  voucherCode: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'monospace'
  },
  // ✨ NEW: Style for hidden voucher code
  hiddenCode: {
    color: '#999',
    fontStyle: 'italic'
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  expiryText: {
    fontSize: 12,
    color: '#666',
    flex: 1
  },
  saveButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3'
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc'
  },
  saveButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500'
  },
  expiredText: {
    color: '#999'
  }
});