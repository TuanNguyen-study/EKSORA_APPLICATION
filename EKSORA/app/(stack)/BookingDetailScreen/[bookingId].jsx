import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, ActivityIndicator,
  TouchableOpacity, StatusBar, RefreshControl, Platform, Linking, Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

// --- Imports ---
import { getBookingById } from '../../../API/services/booking'; 
import InfoRow from './components/InfoRow'; 

// --- Màn hình chi tiết đơn hàng ---
const BookingDetailScreen = () => {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();

  // --- State & Logic ---
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Các hàm định dạng & Helper ---
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
  const formatPrice = (price) => `${(price || 0).toLocaleString('vi-VN')} VND`;

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': case 'confirmed':
        return { style: { backgroundColor: '#27AE60' }, text: 'Đã xác nhận', icon: 'check-circle' };
      case 'pending':
        return { style: { backgroundColor: '#F2C94C' }, text: 'Chờ thanh toán', icon: 'clock-time-nine' };
      case 'cancelled':
        return { style: { backgroundColor: '#E74C3C' }, text: 'Đã hủy', icon: 'close-circle' };
      default:
        return { style: { backgroundColor: '#5A6A7A' }, text: 'Không rõ', icon: 'help-circle' };
    }
  };

  // Cập nhật hàm chỉ đường để hoạt động ổn định trên cả iOS và Android
  const handleGetDirections = (location) => {
    if (!location) {
      console.warn("Không có địa điểm để chỉ đường.");
      return;
    }
    // Mã hóa địa điểm để đảm bảo URL hợp lệ (xử lý dấu, khoảng trắng...)
    const encodedLocation = encodeURIComponent(location);
    
    // Sử dụng URL Google Maps phổ thông, hoạt động trên mọi nền tảng
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

    // Mở URL và bắt lỗi nếu có
    Linking.openURL(url).catch(err => {
        console.error("Không thể mở bản đồ:", err);
        Alert.alert("Lỗi", "Không thể mở ứng dụng bản đồ.");
    });
  };
  // <<< END: PHẦN CẬP NHẬT QUAN TRỌNG >>>

  // --- Logic tải dữ liệu ---
  const fetchBookingDetails = useCallback(async () => {
    if (!bookingId) {
      setError('Không tìm thấy mã đơn hàng.');
      setLoading(false);
      return;
    }
    try {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      if (!token) throw new Error('Yêu cầu xác thực, vui lòng đăng nhập lại.');
      
      const response = await getBookingById(bookingId, token);
      if (response?.booking) {
        setBooking(response.booking);
        setError(null);
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ.');
      }
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [bookingId]);

  useEffect(() => {
    setLoading(true);
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  // --- Giao diện Loading  ---
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  // --- Giao diện Error  ---
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <MaterialCommunityIcons name="cloud-alert" size={60} color="#5A6A7A" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Giao diện chính ---
  const { tour_id: tour, status, fullName, email, phone, travel_date, quantity_nguoiLon, quantity_treEm, totalPrice, _id } = booking;
  const statusInfo = getStatusInfo(status);
  const qrValue = _id;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#2C3E50" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image source={{ uri: tour.image[0] }} style={styles.headerImage} />
        
        <View style={styles.contentBody}>
          <View style={[styles.card, styles.heroCard]}>
            <Text style={styles.tourName}>{tour.name}</Text>
            <View style={[styles.statusBadge, statusInfo.style]}>
              <MaterialCommunityIcons name={statusInfo.icon} size={14} color="#FFFFFF" />
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </View>
            <View style={styles.heroDetails}>
              <View style={styles.qrSection}>
                <View style={styles.qrCodeWrapper}>
                  <QRCode value={qrValue} size={80} backgroundColor="#FFFFFF" />
                </View>
                <Text style={styles.qrHelpText}>Dùng mã này để soát vé</Text>
              </View>
              <View style={styles.heroInfo}>
                <InfoRow icon="map-marker-outline" label="Địa điểm" value={tour.location} />
                <InfoRow icon="calendar-month-outline" label="Ngày đi" value={formatDate(travel_date)} />
                <InfoRow icon="clock-start" label="Giờ mở cửa" value={`${tour.opening_time} - ${tour.closing_time}`} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Thông tin liên hệ</Text>
            <InfoRow icon="account-outline" label="Họ và tên" value={fullName} />
            <InfoRow icon="email-outline" label="Email" value={email} />
            <InfoRow icon="phone-outline" label="Số điện thoại" value={phone} />
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Tóm tắt thanh toán</Text>
            {quantity_nguoiLon > 0 && <InfoRow icon="account" label={`Vé người lớn (x${quantity_nguoiLon})`} value={formatPrice(tour.price * quantity_nguoiLon)} />}
            {quantity_treEm > 0 && <InfoRow icon="human-child" label={`Vé trẻ em (x${quantity_treEm})`} value={formatPrice(tour.price_child * quantity_treEm)} />}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleGetDirections(tour.location)}>
          <MaterialCommunityIcons name="directions" size={22} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Chỉ đường</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${phone}`)}>
          <MaterialCommunityIcons name="face-agent" size={22} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Hỗ trợ</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
        <Ionicons name="arrow-back" size={24} color="#2C3E50" />
      </TouchableOpacity>
    </View>
  );
};

// --- Styles (sử dụng mã màu trực tiếp) ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F7FC',
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F39C12',
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  customBackButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 30 : 50, // <-- Tinh chỉnh hợp lý của bạn
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  headerImage: {
    height: 220,
    width: '100%',
  },
  contentBody: {
    paddingHorizontal: 16,
    marginTop: -80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#4C5B7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  heroCard: {
    paddingTop: 20,
  },
  tourName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D2A38',
    marginBottom: 12,
    lineHeight: 30,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  heroDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrSection: {
    alignItems: 'center',
  },
  qrCodeWrapper: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  qrHelpText: {
    fontSize: 11,
    color: '#5A6A7A',
    marginTop: 8,
  },
  heroInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D2A38',
    marginBottom: 20,
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEBEE',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D2A38',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F39C12',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: '#2C3E50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default BookingDetailScreen;