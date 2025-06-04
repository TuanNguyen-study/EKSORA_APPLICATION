import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { tours } from '../Component/tours'; // Dữ liệu tour
import FavoriteItem from '../FavoriteItem';

export default function Body({ filterData }) {
  const { selectedDestination, selectedCategory, selectedTime } = filterData;

  const filteredTours = tours.filter((tour) => {
    let matches = true;

    if (selectedDestination && tour.location.toLowerCase().trim() !== selectedDestination.toLowerCase().trim()) {
      matches = false;
    }

    if (selectedTime) {
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

  return (
    <View style={{ padding: 16 }}>
      {filteredTours.length === 0 ? (
        <Text style={styles.noResults}>Không có kết quả nào phù hợp</Text>
      ) : (
        <FlatList
          data={filteredTours}
          renderItem={({ item }) => <FavoriteItem {...item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});
