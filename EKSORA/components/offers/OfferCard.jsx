import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function OfferCard({ offer }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.description}>{offer.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderRadius: 10, padding: 16, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  description: { fontSize: 14, color: COLORS.text, marginTop: 5 },
});