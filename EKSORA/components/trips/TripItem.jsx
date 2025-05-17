import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function TripItem({ trip }) {
  return (
    <View style={styles.item}>
      <Text style={styles.destination}>{trip.destination}</Text>
      <Text style={styles.date}>Ngày đi: {trip.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: COLORS.white, borderRadius: 10, padding: 16, marginBottom: 16 },
  destination: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  date: { fontSize: 14, color: COLORS.text, marginTop: 5 },
});