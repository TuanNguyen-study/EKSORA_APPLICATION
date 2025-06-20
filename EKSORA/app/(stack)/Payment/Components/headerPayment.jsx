import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Header() {
  return (
    <View style={styles.header}>
      <Ionicons name="chevron-back" size={24} onPress={() => router.back('/(stack)/trip-detail')}/>
      <Text style={styles.headerTitle}>Hoàn tất đơn hàng</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
