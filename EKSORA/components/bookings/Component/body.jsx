import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getBooking } from '../../../API/services/servicesBooking'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function Body() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); 
        if (userId) {
          const data = await getBooking(userId);
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
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.status}>{`Trạng thái: ${item.status}`}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
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
