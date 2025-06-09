import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/colors';

const LoadingScreen = ({ message = 'Đang tải...', color = '#ff6347' }) => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
export default LoadingScreen;
