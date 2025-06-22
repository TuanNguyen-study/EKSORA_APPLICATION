import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomPayment = () => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.row}>
        <View>
          <Text style={styles.total}>₫ 747,000</Text>
          <Text style={styles.discount}>Giảm 64,000₫</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default BottomPayment;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discount: {
    color: 'green',
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});