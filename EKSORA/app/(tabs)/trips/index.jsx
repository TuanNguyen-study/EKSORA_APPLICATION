import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import TripItem from '../../../components/trips/TripItem';

const trips = [
  { id: '1', destination: 'Paris', date: '20/06/2025' },
  { id: '2', destination: 'Tokyo', date: '25/06/2025' },
];

export default function TripsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chuyến đi</Text>
      {trips.length === 0 ? (
        <Text style={styles.subtitle}>Chưa có chuyến đi nào.</Text>
      ) : (
        <FlatList
          data={trips}
          renderItem={({ item }) => <TripItem trip={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  subtitle: { fontSize: 16, color: COLORS.text },
});