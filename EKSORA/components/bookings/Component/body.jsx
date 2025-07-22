import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { getTrips } from '../../../API/services/servicesBooking'; // Giữ nguyên API call của bạn
import TripItem from '../TripItem'; // Quan trọng: Đảm bảo TripItem được thiết kế dạng Card
import EmptyTrips from '../Component/EmptyTrips';

// Component Tab không đổi, đã rất tốt
const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.activeTab]}>
    <Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

// Component phân cách giữa các item trong FlatList
const Separator = () => <View style={styles.separator} />;

export default function Body() {
  const [loading, setLoading] = useState(true);
  const [activeTrips, setActiveTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const userId = await AsyncStorage.getItem('USER_ID');
        if (userId) {
          const allTripsFromApi = await getTrips(userId);
          const filteredActiveTrips = allTripsFromApi.filter(
            (trip) => trip.status !== 'canceled'
          );
          setActiveTrips(filteredActiveTrips);
        } else {
          console.warn('Không tìm thấy userId');
        }
      } catch (error) {
        console.error('Lỗi khi tải chuyến đi:', error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchTrips();
  }, []);

  const getDisplayedTrips = () => {
    if (activeTab === 'all') {
      return activeTrips;
    }
    return activeTrips.filter((trip) => trip.status === activeTab);
  };

  const displayedTrips = getDisplayedTrips();

  // === CẢI TIẾN UX: Tách phần render nội dung ra khỏi khung chính ===
  const renderContent = () => {
    if (loading) {
      // Chỉ hiển thị loading ở khu vực nội dung
      return (
        <View style={styles.contentCenter}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    return (
      <FlatList
        data={displayedTrips}
        renderItem={({ item }) => <TripItem item={item} />}
        keyExtractor={(item) => item._id}
        // Thêm khoảng cách và padding cho nội dung list
        contentContainerStyle={styles.listContentContainer}
        // Dùng component phân cách để code sạch hơn
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <View style={styles.contentCenter}>
            <EmptyTrips />
            <Text style={styles.emptyText}>Bạn không có vé nào trong mục này.</Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Thanh Tab */}
      <View style={styles.tabContainer}>
        <Tab title="Tất cả" active={activeTab === 'all'} onPress={() => setActiveTab('all')} />
        <Tab title="Đang chờ" active={activeTab === 'pending'} onPress={() => setActiveTab('pending')} />
        <Tab title="Đã xác nhận" active={activeTab === 'confirmed'} onPress={() => setActiveTab('confirmed')} />
      </View>

      {/* Khu vực nội dung chính */}
      {renderContent()}
    </SafeAreaView>
  );
}

// === CẢI TIẾN GIAO DIỆN: Cập nhật và bổ sung StyleSheet ===
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f4f6f8', // Màu nền dịu mắt
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  // --- Header Styles ---
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#f4f6f8', // Đồng bộ màu nền
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  // --- Tab Styles ---
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Bắt đầu từ bên trái cho đẹp hơn
    gap: 12, // Khoảng cách giữa các tab
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f4f6f8', // Đồng bộ màu nền
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e9ecef', // Màu nền cho tab không active
  },
  activeTab: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF', // Thêm đổ bóng cho tab active
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // --- List & Content Styles ---
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: -50, // Kéo lên một chút để cân đối hơn
  },
  listContentContainer: {
    paddingHorizontal: 16, // Padding hai bên cho các card
    paddingVertical: 20, // Padding trên dưới
  },
  separator: {
    height: 16, // Khoảng cách giữa các card
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});