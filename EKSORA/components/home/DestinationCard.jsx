import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function DestinationCard({ destination, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={destination.image} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{destination.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 200, marginRight: 16, backgroundColor: COLORS.white, borderRadius: 10 },
  cardImage: { width: '100', height: 120 },
  cardTitle: { fontSize: 18, fontWeight: '600', padding: 10, color: COLORS.text },
});