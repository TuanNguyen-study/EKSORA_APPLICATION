import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUserBookings } from '../../../API/services/servicesUser';
import { COLORS } from '../../../constants/colors';
import BookingItem from './BookingItem';

const filterTabs = [
  { status: 'waiting', title: 'Đang chờ' },
  { status: 'paid', title: 'Đã thanh toán' },
  { status: 'canceled', title: 'Đã hủy' },
];

// Helper lấy tên user từ AsyncStorage
const getCurrentUserName = async () => {
  try {
    const profileStr = await AsyncStorage.getItem('USER_PROFILE');
    if (!profileStr) return '';
    const profile = JSON.parse(profileStr);
    // Ưu tiên trường name, nếu không có thì ghép first_name + last_name
    return profile.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  } catch (e) {
    return '';
  }
};

// Helper lấy email user từ AsyncStorage
const getCurrentUserEmail = async () => {
  try {
    const profileStr = await AsyncStorage.getItem('USER_PROFILE');
    if (!profileStr) return '';
    const profile = JSON.parse(profileStr);
    return profile.email || '';
  } catch (e) {
    return '';
  }
};

export default function MyBookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('waiting');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!userId || !token) {
        setError('Không tìm thấy người dùng hoặc token');
        return;
      }
      const data = await getUserBookings(userId, token);
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setBookings(sortedData);
    } catch (err) {
      setError('Lỗi khi tải danh sách đơn hàng');
      console.error('Lỗi API:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings().finally(() => setLoading(false));
    }, [])
  );

  useEffect(() => {
    const savePaidBookingsToStorage = async () => {
      const paidStatuses = ['paid', 'completed'];
      const paidBookings = bookings.filter(booking =>
        paidStatuses.includes(booking.status?.toLowerCase().trim())
      );

      try {
        if (paidBookings.length > 0) {
          const jsonValue = JSON.stringify(paidBookings);
          await AsyncStorage.setItem('@paid_bookings', jsonValue);
        } else {
          await AsyncStorage.removeItem('@paid_bookings');
        }
      } catch (e) {
        console.error('Lỗi khi thao tác với AsyncStorage cho paid_bookings:', e);
      }
    };

    if (bookings.length > 0) {
      savePaidBookingsToStorage();
    }
  }, [bookings]);

  useEffect(() => {
    // Lấy tên user và email khi vào màn hình
    getCurrentUserName().then(setUserName);
    getCurrentUserEmail().then(setUserEmail);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const filteredBookings = useMemo(() => {
    const waitingStatuses = ['pending', 'confirmed', 'ongoing'];
    const paidStatuses = ['paid', 'completed'];
    const canceledStatuses = ['canceled', 'refund_requested', 'refunded', 'expired'];

    let filtered = [];
    switch (selectedStatus) {
      case 'waiting':
        filtered = bookings.filter(booking => waitingStatuses.includes(booking.status?.toLowerCase().trim()));
        break;
      case 'paid':
        filtered = bookings.filter(booking => paidStatuses.includes(booking.status?.toLowerCase().trim()));
        break;
      case 'canceled':
        filtered = bookings.filter(booking => canceledStatuses.includes(booking.status?.toLowerCase().trim()));
        break;
      default:
        filtered = [];
    }
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookings, selectedStatus]);

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            {filterTabs.map(tab => (
              <Pressable
                key={tab.status}
                style={[styles.filterButton, selectedStatus === tab.status && styles.filterButtonActive]}
                onPress={() => setSelectedStatus(tab.status)}
              >
                <Text style={[styles.filterText, selectedStatus === tab.status && styles.filterTextActive]}>
                  {tab.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={({ item }) => (
              <BookingItem
                item={item}
                userName={userName} // Truyền userName vào BookingItem
                userEmail={userEmail} // Nếu cần hiển thị email
                onPress={() => router.push(`/BookingDetailScreen/${item._id}`)}
              />
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
    marginTop: 16,
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
