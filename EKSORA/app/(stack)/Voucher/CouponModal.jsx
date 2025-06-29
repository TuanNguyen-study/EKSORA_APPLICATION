import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getPromotion,
  saveUserVoucher,
  getUserSavedVouchers,
  saveVoucherId,
} from '../../../API/services/servicesPromotion';
import CouponTicket from './CouponTicket';
import { COLORS } from '../../../constants/colors';

const CouponModal = ({ visible, onClose }) => {
  const [coupons, setCoupons] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savingVoucherId, setSavingVoucherId] = useState(null);

  useEffect(() => {
    if (visible && !isFetched) {
      fetchPromotions();
    }
  }, [visible, isFetched]);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
        return;
      }

      const [promotionList, savedList] = await Promise.all([
        getPromotion(),
        getUserSavedVouchers(userId),
      ]);

      const savedVoucherIds = savedList.map(item => item.voucher_id);

      if (!Array.isArray(promotionList)) {
        console.warn('Dữ liệu khuyến mãi không hợp lệ:', promotionList);
        setCoupons([]);
        return;
      }

      const mapped = promotionList.map(item => ({
        id: item._id,
        mainTitle: item.condition || `Ưu đãi từ mã ${item.code}`,
        expiryText: item.end_date ? `Hết hạn: ${formatDate(item.end_date)}` : null,
        discountAmount: `Giảm ${item.discount}%`,
        detailsText: `Mã: ${item.code}`,
        status: savedVoucherIds.includes(item._id) ? 'saved' : 'available',
      }));

      setCoupons(mapped);
      setIsFetched(true);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách khuyến mãi.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${day}/${month} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const toggleStatus = useCallback(async (voucherId) => {
    setSavingVoucherId(voucherId);
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
        return;
      }

      const res = await saveUserVoucher(userId, voucherId);
      console.log('Response saveUserVoucher:', res);

      if (res?.message === "Lưu voucher thành công") {
        await saveVoucherId(voucherId); 
        setCoupons(prevCoupons =>
          prevCoupons.map(c =>
            c.id === voucherId ? { ...c, status: 'saved' } : c
          )
        );
        Alert.alert('Thành công', 'Đã lưu mã khuyến mãi!');
      } else {
        Alert.alert('Lỗi', res?.message || 'Không thể lưu mã khuyến mãi.');
      }
    } catch (apiError) {
      console.error('Lỗi khi lưu voucher:', apiError);
      if (
        apiError.response?.status === 400 &&
        apiError.response?.data?.message === 'Bạn đã lưu voucher này rồi'
      ) {
        Alert.alert('Thông báo', 'Bạn đã lưu voucher này rồi.');
        setCoupons(prevCoupons =>
          prevCoupons.map(c =>
            c.id === voucherId ? { ...c, status: 'saved' } : c
          )
        );
      } else {
        Alert.alert('Lỗi', apiError.response?.data?.message || 'Có lỗi xảy ra khi xử lý mã khuyến mãi.');
      }
    } finally {
      setSavingVoucherId(null);
    }
  }, []);

  const renderCoupon = ({ item }) => {
    const isSaving = savingVoucherId === item.id;
    return (
      <CouponTicket
        mainTitle={item.mainTitle}
        expiryText={item.expiryText}
        discountAmount={item.discountAmount}
        detailsText={item.detailsText}
        status={item.status}
        onToggleStatus={() => {
          if (item.status === 'available' && !isSaving) {
            toggleStatus(item.id);
          }
        }}
        loading={isSaving}
      />
    );
  };

  const getItemLayout = (_, index) => ({
    length: 135,
    offset: 135 * index,
    index,
  });

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Quà tặng bạn mới</Text>
            <Text style={styles.headerSubtitle}>Giảm đến 10%</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primaryBlue} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              data={coupons}
              renderItem={renderCoupon}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                  Hiện chưa có mã ưu đãi.
                </Text>
              }
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              getItemLayout={getItemLayout}
              removeClippedSubviews
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Xem ưu đãi trong Tài khoản của bạn</Text>
            <View style={styles.termsContainer}>
              <Text style={styles.footerText}>Điều khoản & Điều kiện</Text>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>i</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.primaryBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '55%',
  },
  header: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.black,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 4,
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: COLORS.white,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.grayText,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayText,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  infoIconText: {
    fontSize: 10,
    color: COLORS.grayText,
    fontWeight: 'bold',
  },
});

export default CouponModal;
