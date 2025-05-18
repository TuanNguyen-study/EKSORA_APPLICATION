import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import FavoriteItem from '../../../components/favorites/FavoriteItem';

const favorites = [
  { id: '1', name: 'Paris', date: 'Added on May 2025' },
  { id: '2', name: 'Tokyo', date: 'Added on May 2025' },
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu thích</Text>
      {favorites.length === 0 ? (
        <Text style={styles.subtitle}>Chưa có chuyến đi yêu thích nào.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => <FavoriteItem favorite={item} />}
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