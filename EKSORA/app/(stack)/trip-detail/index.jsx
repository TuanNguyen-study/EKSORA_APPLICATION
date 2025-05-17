import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux'; 
import { COLORS } from '@/constants/colors';

export default function TripDetailScreen() {
  const trip = useSelector(state => state.trip.selectedTrip);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy thông tin chuyến đi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Details</Text>
      <Text style={styles.subtitle}>Bạn đã chọn: {trip.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  subtitle: { fontSize: 16, color: COLORS.text },
});
