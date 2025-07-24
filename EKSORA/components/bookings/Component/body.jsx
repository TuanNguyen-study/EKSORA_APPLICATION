import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getTrips } from '../../../API/services/servicesBooking';
import EmptyTrips from '../Component/EmptyTrips';
import TripItem from '../TripItem';

// --- Component Tab  ---
const Tab = ({ title, active, onPress }) => {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <LinearGradient
          colors={['#56CCF2', '#2F80ED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.filterChip, styles.activeFilterChip]}
        >
          <Text style={[styles.filterChipText, styles.activeFilterChipText]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.filterChip}>
      <Text style={styles.filterChipText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function Body() {
  const [loading, setLoading] = useState(true);
  const [allTrips, setAllTrips] = useState([]); // Lưu tất cả trips ở đây
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('USER_ID');
        if (userId) {
          const allTripsFromApi = await getTrips(userId);
          
          if (Array.isArray(allTripsFromApi) && allTripsFromApi.length > 0) {
            allTripsFromApi.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          }


          setAllTrips(allTripsFromApi); 
        } else {
          console.warn('Không tìm thấy userId');
        }
      } catch (error) {
        console.error('Lỗi khi tải chuyến đi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const getDisplayedTrips = () => {
    switch (activeTab) {
      case 'all':
        // Lọc ra những vé không bị hủy cho tab "Tất cả"
        return allTrips.filter((trip) => trip.status !== 'canceled');
      case 'pending':
      case 'confirmed':
        return allTrips.filter((trip) => trip.status === activeTab);
      default:
        return [];
    }
  };

  const displayedTrips = getDisplayedTrips();

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.contentCenter}>
          <ActivityIndicator size="large" color="#2F80ED" />
        </View>
      );
    }

    return (
      <FlatList
        data={displayedTrips}
        renderItem={({ item }) => <TripItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContentContainer}
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

// --- Stylesheet không thay đổi ---
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E9EEF2',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterChip: {
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  filterChipText: {
    fontSize: 14,
    color: '#4A6A8A',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 50,
  },
  listContentContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 17,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});