import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from "../../../../constants/colors";
import { router, useLocalSearchParams } from 'expo-router';

export default function PriceFooter() {
  const { totalPrice } = useLocalSearchParams();
  const formattedPrice = parseInt(totalPrice || '0', 10).toLocaleString('vi-VN') + ' đ';

  const handleBooking = () => {
    Alert.alert(
      "Đặt thành công!",
      "Cảm ơn bạn đã đặt tour.",
      [
        {
          text: "OK",
          onPress: () => router.replace('/(tabs)/home'),
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.footer}>
      <View style={styles.priceBox}>
        <Text style={styles.label}>Bao gồm</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text style={styles.subtext}>Mỗi người</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleBooking}>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary || '#e53935',
    marginTop: 4,
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
