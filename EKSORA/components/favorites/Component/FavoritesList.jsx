import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet } from 'react-native';
import FavoriteItem from './FavoriteItem';
import { getFavorites } from '../../../API/services/servicesFavorite';

export default function FavoritesList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites();
      setTours(data);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (tours.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Không có tour yêu thích.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {tours.map((tour) => (
        <FavoriteItem
          key={tour.id}
          title={tour.title}
          location={tour.location}
          description={tour.description}
          price={tour.price}
          image={tour.image}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
