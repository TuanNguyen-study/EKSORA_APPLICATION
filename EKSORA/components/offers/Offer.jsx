import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPromotion, saveUserVoucher, getSavedVoucherIds, saveVoucherId } from '../../API/services/servicesPromotion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CouponModal from '../../app/(stack)/Voucher/CouponModal';

const { width: screenWidth } = Dimensions.get('window');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Không xác định';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Offer() {
  const [coupons, setCoupons] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPromotions = async () => {
    try {
      const response = await getPromotion();
      if (!Array.isArray(response)) return;

      // Lấy danh sách voucher đã lưu từ AsyncStorage
      const savedIds = await getSavedVoucherIds();

      // Lọc voucher chưa lưu
      const filteredVouchers = response.filter(item => !savedIds.includes(item._id));

      // Map dữ liệu cho phù hợp với UI
      const mappedCoupons = filteredVouchers.map(item => ({
        id: item._id,
        title: 'Mã giảm giá',
        discount: item.discount ? `Giảm ${item.discount}%` : 'Ưu đãi',
        condition: item.condition || `Áp dụng đơn từ...`,
        buttonText: 'Lưu',
        expiry: item.end_date ? `HSD: ${formatDate(item.end_date)}` : null,
      }));

      setCoupons(mappedCoupons);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách mã khuyến mãi:', error);
    }
  };

  const handleSave = async (voucherId) => {
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      const response = await saveUserVoucher(userId, voucherId);

      if (response?.message === 'Bạn đã lưu voucher này rồi') {
        Alert.alert('Thông báo', 'Bạn đã lưu voucher này rồi');
        return;
      }

      // Lưu voucherId vào AsyncStorage local
      await saveVoucherId(voucherId);

      // Xóa voucher vừa lưu khỏi state để không hiển thị nữa
      setCoupons(currentCoupons => currentCoupons.filter(coupon => coupon.id !== voucherId));

      Alert.alert('Thành công', 'Đã lưu voucher');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu voucher');
      console.error('Lỗi khi lưu voucher:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#007ecc', '#007ecc']} style={styles.headerContainer}>
        <Text style={styles.header}>Mã ưu đãi</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {coupons.slice(0, 10).map((offer, index) => (
          <View
            key={offer.id || index}
            style={styles.cardWrapper}
          >
            <LinearGradient colors={['#00639B', '#0087CA']} style={styles.codeBox}>
              <View style={styles.boxHeader}>
                <Text style={styles.boxHeaderText}>{offer.title}</Text>
              </View>
              <View style={styles.boxBody}>
                <Text style={styles.discount}>{offer.discount}</Text>
                <Text style={styles.condition}>{offer.condition}</Text>
                {offer.expiry && <Text style={styles.condition}>{offer.expiry}</Text>}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSave(offer.id)}
                >
                  <Text style={styles.buttonText}>{offer.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      <CouponModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </View>
  );
}

// (style giữ nguyên như bạn đã viết)
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  seeAll: {
    color: 'white',
    fontSize: 14,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 12,
  },
  cardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  codeBox: {
    width: screenWidth * 0.3,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  boxHeader: {
    backgroundColor: '#0090d0',
    paddingVertical: 6,
    alignItems: 'center',
  },
  boxHeaderText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  boxBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  condition: {
    fontSize: 12,
    color: '#e0f0ff',
    textAlign: 'center',
  },
  buttonText: {
    color: '#005bac',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    width: '100%',
    borderWidth: 0.5,
  },
});
