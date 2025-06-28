import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingItem from './BookingItem';
import { getUserBookings } from '../../../API/services/servicesUser';
import { COLORS } from '../../../constants/colors';  

const filterTabs = [
  { status: 'confirmed', title: 'Đã xác nhận' },
  { status: 'pending', title: 'Đang chờ' },
  { status: 'cancelled', title: 'Đã hủy' },
];

export default function MyBookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('confirmed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy userId từ AsyncStorage và gọi API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("ACCESS_TOKEN");
        const userId = await AsyncStorage.getItem("USER_ID");
        console.log("USER_ID:", userId);
        console.log("TOKEN:", token);

        if (!userId || !token) {
          setError('Không tìm thấy người dùng hoặc token');
          return;
        }
        const data = await getUserBookings(userId, token);
        setBookings(data);
      } catch (err) {
        setError('Lỗi khi tải danh sách đơn hàng');
        console.error('Lỗi API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => booking.status === selectedStatus);
  }, [bookings, selectedStatus]);

 const handleItemPress = (item) => {
  if (item?.tour_id?._id) {
    router.push(`/trip-detail/${item.tour_id._id}`);
  } else {
    alert("Không tìm thấy thông tin tour.");
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
        <View style={styles.filterContainer}>
          {filterTabs.map(tab => (
            <Pressable
              key={tab.status}
              style={[
                styles.filterButton,
                selectedStatus === tab.status && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus(tab.status)}
            >
              <Text style={[
                styles.filterText,
                selectedStatus === tab.status && styles.filterTextActive
              ]}>
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </View>

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
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    flex: 1,
    marginTop: 100,
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
