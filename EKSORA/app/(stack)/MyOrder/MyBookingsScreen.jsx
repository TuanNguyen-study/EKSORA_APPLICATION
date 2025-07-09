import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // ✅ thêm
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable, // ✅ thêm
  SafeAreaView,
  ScrollView,
  StatusBar,
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
  { status: 'pending', title: 'Đang chờ xác nhận' },
  { status: 'confirmed', title: 'Đã giữ chỗ' },
  { status: 'paid', title: 'Đã thanh toán' },
  { status: 'ongoing', title: 'Đang diễn ra' },
  { status: 'completed', title: 'Hoàn thành' },
  { status: 'canceled', title: 'Đã hủy' },
  { status: 'refund_requested', title: 'Yêu cầu hoàn tiền' },
  { status: 'refunded', title: 'Đã hoàn tiền' },
  { status: 'expired', title: 'Hết hạn thanh toán' },
];

export default function MyBookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('confirmed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // ✅ trạng thái làm mới

  // ✅ Hàm fetch API dùng lại cho cả focus và refresh
  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!userId || !token) {
        setError('Không tìm thấy người dùng hoặc token');
        return;
      }
      const data = await getUserBookings(userId, token);
      setBookings(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách đơn hàng');
      console.error('Lỗi API:', err);
    }
  };

  // ✅ Gọi API khi focus vào màn hình
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings().finally(() => setLoading(false));
    }, [])
  );

  // ✅ Gọi khi người dùng kéo xuống để làm mới
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const st = (booking.status || '').toLowerCase().trim();
      return st === selectedStatus;
    });
  }, [bookings, selectedStatus]);

  const handleItemPress = async (item) => {
    try {
      const detail = await getBookingDetailById(item._id);
      router.push({
        pathname: `/booking-detail/${item._id}`,
        params: { bookingData: JSON.stringify(detail) }
      });
    } catch (error) {
      alert('Không thể lấy dữ liệu chi tiết đơn hàng!');
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
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs lọc */}
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

        {/* Danh sách đơn hàng */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={({ item }) => (
              <BookingItem item={item} onPress={handleItemPress} />
            )}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing} // ✅ Trạng thái xoay khi kéo xuống
            onRefresh={onRefresh}   // ✅ Hàm được gọi khi người dùng kéo
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.grey,
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.grey,
  },
});
