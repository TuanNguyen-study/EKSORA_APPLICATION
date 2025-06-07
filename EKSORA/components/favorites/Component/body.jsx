import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FavoriteItem from '../FavoriteItem';
import { getFavorites } from '../../../API/services/servicesFavorite';

export default function Body({ filterData }) {
  const { userId, selectedDestination, selectedCategory, selectedTime } = filterData;
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn('Chưa có userId để lấy danh sách favorites');
      setLoading(false);
      return;
    }

    const fetchTours = async () => {
      try {
        const data = await getFavorites(userId); // SỬ DỤNG userId ở đây
        setTours(data);
      } catch (error) {
        console.error('Lỗi khi tải tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [userId]);

  const filteredTours = tours.filter((tour) => {
    if (!tour.id) return false;

    let matches = true;

    if (
      selectedDestination &&
      tour.location?.toLowerCase().trim() !== selectedDestination.toLowerCase().trim()
    ) {
      matches = false;
    }

    if (selectedCategory && tour.category !== selectedCategory) {
      matches = false;
    }

    if (selectedTime && tour.createdAt) {
      const currentDate = new Date();
      const tourDate = new Date(tour.createdAt);
      const timeDiff = Math.floor((currentDate - tourDate) / (1000 * 3600 * 24));

      if (selectedTime === 'Trong 7 ngày trước' && timeDiff > 7) {
        matches = false;
      } else if (selectedTime === 'Trong 30 ngày trước' && timeDiff > 30) {
        matches = false;
      } else if (selectedTime === 'Trong 6 tháng trước' && timeDiff > 180) {
        matches = false;
      } else if (selectedTime === 'Trong 12 tháng trước' && timeDiff > 365) {
        matches = false;
      } else if (selectedTime === 'Trong hơn 1 năm trước' && timeDiff <= 365) {
        matches = false;
      }
    }

    return matches;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredTours}
      renderItem={({ item }) => <FavoriteItem {...item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={filteredTours.length === 0 ? styles.noResultsContainer : { padding: 16 }}
      ListEmptyComponent={<Text style={styles.noResults}>Không có kết quả nào phù hợp</Text>}
    />
  );
}

const styles = StyleSheet.create({
  noResultsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
