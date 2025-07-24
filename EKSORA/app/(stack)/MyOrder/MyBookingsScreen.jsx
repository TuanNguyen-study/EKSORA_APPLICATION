import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getBookingDetailById } from '../../../API/services/bookingdetailService';
import { getUserBookings } from '../../../API/services/servicesUser';
import { COLORS } from '../../../constants/colors';
import BookingItem from './BookingItem';

const filterTabs = [
  { status: 'waiting', title: 'Đang chờ' },
  { status: 'paid', title: 'Đã thanh toán' },
  { status: 'canceled', title: 'Đã hủy' },
];

export default function MyBookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('waiting');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  //  Hàm fetch API dùng lại cho cả focus và refresh
const fetchBookings = async () => {
  try {
    const token = await AsyncStorage.getItem("ACCESS_TOKEN");
    const userId = await AsyncStorage.getItem("USER_ID");
    if (!userId || !token) {
      setError('Không tìm thấy người dùng hoặc token');
      return;
    }

    const data = await getUserBookings(userId, token);

    // 👉 SẮP XẾP Ở ĐÂY TRƯỚC KHI SET VÀO STATE
    const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setBookings(sortedData); // ✅ đã sort
  } catch (err) {
    setError('Lỗi khi tải danh sách đơn hàng');
    console.error('Lỗi API:', err);
  }
};


  // Gọi API khi focus vào màn hình
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings().finally(() => setLoading(false));
    }, [])
  );

  // Gọi khi người dùng kéo xuống để làm mới
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const filteredBookings = useMemo(() => {
    const waitingStatuses = ['pending', 'confirmed', 'ongoing'];
    const paidStatuses = ['paid', 'completed'];
    const canceledStatuses = ['canceled', 'refund_requested', 'refunded', 'expired'];

    // Lọc danh sách đơn hàng dựa trên tab đang được chọn
    switch (selectedStatus) {
      case 'waiting':
        return bookings.filter(booking => waitingStatuses.includes(booking.status?.toLowerCase().trim()));
      case 'paid':
        return bookings.filter(booking => paidStatuses.includes(booking.status?.toLowerCase().trim()));
      case 'canceled':
        return bookings.filter(booking => canceledStatuses.includes(booking.status?.toLowerCase().trim()));
      default:
        return []; 
    }
  }, [bookings, selectedStatus]);

  const handleItemPress = async (item) => {
    try {
      const detail = await getBookingDetailById(item._id);
      router.push({
        pathname: `/booking-detail/${item._id}`,
        params: { bookingData: JSON.stringify(detail) }
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu chi tiết đơn hàng!');
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="folder-text-outline" size={60} color={COLORS.grey} />
      <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
      <Text style={styles.emptySubText}>Các đơn hàng của bạn sẽ xuất hiện ở đây.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tabs lọc  */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {filterTabs.map(tab => (
              <Pressable
                key={tab.status}
                style={[
                  styles.filterButton,
                  selectedStatus === tab.status && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedStatus(tab.status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedStatus === tab.status && styles.filterTextActive,
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        
        {/* Danh sách đơn hàng */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={({ item }) => (
              <BookingItem item={item} onPress={() => handleItemPress(item)} />
            )}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  filterWrapper: {
    backgroundColor: COLORS.white,
    paddingBottom: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.grey,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});