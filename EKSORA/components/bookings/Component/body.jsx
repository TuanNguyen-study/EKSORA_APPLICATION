import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { getTrips } from '../../../API/services/servicesBooking';
import EmptyTrips from '../Component/EmptyTrips';
import TripItem from '../TripItem';

// Component Tab không thay đổi
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

export default function Body({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [allTrips, setAllTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(null); // trạng thái đăng nhập

  // Check login + fetch trips
  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        setLoading(true);
        try {
          const userId = await AsyncStorage.getItem('USER_ID');
          if (!userId) {
            setIsLoggedIn(false);
            setAllTrips([]);
            return;
          }
          setIsLoggedIn(true);

          const allTripsFromApi = await getTrips(userId);
          if (Array.isArray(allTripsFromApi) && allTripsFromApi.length > 0) {
            allTripsFromApi.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
          }
          setAllTrips(allTripsFromApi);
        } catch (error) {
          console.error('Lỗi khi tải chuyến đi:', error);
          setAllTrips([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTrips();
    }, [])
  );

  const getDisplayedTrips = () => {
    const normalizeStatus = (status) => status?.toLowerCase() || '';
    switch (activeTab) {
      case 'all':
        return allTrips.filter(
          (trip) =>
            normalizeStatus(trip.status) !== 'canceled' &&
            normalizeStatus(trip.status) !== 'canceled'
        );
      case 'pending':
      case 'paid':
        return allTrips.filter((trip) => normalizeStatus(trip.status) === activeTab);
      default:
        return [];
    }
  };

  // UI nếu chưa đăng nhập
  if (isLoggedIn === false) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.contentCenter}>
          <Image
            source={require('../../../assets/images/tripsImage.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>
            Hãy đăng nhập để khám phá nhiều hơn
          </Text>
          <Text style={{ color: '#6c757d', marginTop: 4, textAlign: 'center' }}>
            Bạn cần đăng nhập để tiếp tục sử dụng tính năng này
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(stack)/login/loginEmail')}
            style={[styles.exploreButton, { marginTop: 24 }]}
          >
            <Text style={styles.exploreButtonText}>Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayedTrips = getDisplayedTrips();

  const renderContent = () => {
    if (loading && allTrips.length === 0) {
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
          !loading && (
            <View style={styles.contentCenter}>
              <EmptyTrips />
              <Text style={styles.emptyText}>
                Bạn không có vé nào trong mục này.
              </Text>
            </View>
          )
        }
      />
    );
  };

  return (

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabContainer}
    >
      <Tab title="Tất cả" active={activeTab === 'all'} onPress={() => setActiveTab('all')} />
      <Tab title="Đang chờ" active={activeTab === 'pending'} onPress={() => setActiveTab('pending')} />
      <Tab title="Đã thanh toán" active={activeTab === 'paid'} onPress={() => setActiveTab('paid')} />
      <Tab title="Đã hủy" active={activeTab === 'canceled'} onPress={() => setActiveTab('canceled')} />
    </ScrollView>
  );
}

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

  exploreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
});
