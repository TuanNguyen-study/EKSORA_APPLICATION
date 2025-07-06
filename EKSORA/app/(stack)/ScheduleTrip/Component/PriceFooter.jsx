import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from "../../../../constants/colors";
import { router } from 'expo-router';

export default function PriceFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.priceBox}>
        <Text style={styles.label}>Bao gồm</Text>
        <Text style={styles.price}>1.752.000 đ</Text>
        <Text style={styles.subtext}>Mỗi người</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đặt ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  priceBox: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subtext: {
    fontSize: 12,
    color: '#777',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
