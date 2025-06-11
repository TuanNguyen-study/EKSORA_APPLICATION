import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function TripItem({ trip }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: trip.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.destination}>{trip.destination}</Text>
          <Text style={styles.heart}>❤️</Text>
        </View>

        <Text style={styles.date}>Ngày đi: {trip.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f6fafd',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destination: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  heart: {
    fontSize: 16,
    color: 'red',
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
