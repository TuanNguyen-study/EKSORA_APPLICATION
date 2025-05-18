import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function FavoriteItem({ favorite }) {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{favorite.name}</Text>
      <Text style={styles.date}>{favorite.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: COLORS.white, borderRadius: 10, padding: 16, marginBottom: 16 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  date: { fontSize: 14, color: COLORS.text, marginTop: 5 },
});