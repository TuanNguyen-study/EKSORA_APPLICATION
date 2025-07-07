import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { getTrips } from '../../../API/services/servicesBooking';
import { router } from 'expo-router';

export default function Body() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userId = await AsyncStorage.getItem('USER_ID');
        console.log('🧑 userId từ AsyncStorage:', userId);
        if (userId) {
          const data = await getTrips(userId);
          console.log('📦 Dữ liệu trips từ API:', data);
          setTrips(data);
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


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={trips}
      renderItem={({ item }) => (
        <View style={styles.tripItem}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item?.tour_id?.image?.[0] }}
              style={styles.image}
            />
            <Text style={styles.link} onPress={() => router.push({
              pathname: '/(stack)/Schedule',
              params: {
                tourName: item?.tour_id?.name,
                nguoiLon: item?.quantity_nguoiLon?.toString() || '1',
                treEm: item?.quantity_treEm?.toString() || '0',
                tourImage: item?.tour_id?.image?.[0],
                totalPrice: item?.totalPrice?.toString() || '0'
              }
            })}>
              Gợi ý lịch trình
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item?.tour_id?.name}</Text>
            <Text style={styles.location}>{item?.tour_id?.location}</Text>

            <Text style={styles.info}>
              Ngày đi: {new Date(item.travel_date).toLocaleDateString('vi-VN')}
            </Text>
            <Text style={styles.info}>
              Người lớn: {item.quantity_nguoiLon} | Trẻ em: {item.quantity_treEm}
            </Text>
            <Text style={styles.info}>
              Tổng giá: {item.totalPrice.toLocaleString('vi-VN')} VND
            </Text>

            <Text style={styles.status}>
              Trạng thái: {item.status}
            </Text>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      contentContainerStyle={trips.length === 0 ? styles.noResultsContainer : { padding: 16 }}
      ListEmptyComponent={
        <View style={styles.noResultsContent}>
          <Image
            source={require('../../../assets/images/tripsImage.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.noResults}>Chưa có chuyến đi sắp tới...!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  tripItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  status: {
    fontSize: 13,
    marginTop: 6,
    color: '#444',
    fontStyle: 'italic',
  },
  noResultsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsContent: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  link: {
    marginTop: 4,
    fontSize: 11,
    color: '#2196F3',
    fontStyle: 'italic',
    opacity: 0.8,
    marginStart: 5,
  },
  noResults: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#999",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
