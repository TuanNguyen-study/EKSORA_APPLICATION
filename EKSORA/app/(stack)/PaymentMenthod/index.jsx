import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native'; 
import { router } from 'expo-router';

export default function PaymentScreen() {
  const [selected, setSelected] = useState('momo');
  const handlePayment = () => {
  Alert.alert('Thành công', 'Thanh toán của bạn đã được xử lý thành công!');
};

  const paymentMethods = [
    {
      id: 'momo',
      label: 'MoMo E-Wallet',
      icon: <MaterialCommunityIcons name="cellphone" size={20} color="#C2185B" />,
    },
    {
      id: 'atm',
      label: 'ATM by MoMo',
      sub: 'Hoàn tiền không áp dụng cho lựa chọn thanh toán của bạn',
      icon: <MaterialCommunityIcons name="bank" size={20} color="#F06292" />,
    },
    {
      id: 'credit',
      label: 'Thêm/Quản lý Thẻ tín dụng',
      icon: <FontAwesome5 name="credit-card" size={18} color="#424242" />,
    },
    {
      id: 'google',
      label: 'Google Pay',
      icon: <AntDesign name="google" size={20} color="#4285F4" />,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.push('/(stack)/Payment')}> 
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.totalAmount}>₫ 256,000</Text>

        {/* Thông tin đơn hàng */}
        <TouchableOpacity style={styles.dropdownBtn}>
          <Text style={styles.dropdownText}>Thông tin đơn hàng</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>

        {/* Ưu đãi */}
        <TouchableOpacity style={styles.promoBtn}>
          <Ionicons name="gift-outline" size={16} color="#000" />
          <Text style={styles.promoText}>Sử dụng ưu đãi thanh toán</Text>
          <Ionicons name="chevron-forward" size={16} color="#000" />
        </TouchableOpacity>

        {/* Danh sách phương thức thanh toán */}
        <View style={styles.card}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelected(method.id)}
              style={styles.methodItem}
            >
              {method.icon}
              <View style={styles.labelGroup}>
                <Text style={styles.methodText}>{method.label}</Text>
                {method.sub && (
                  <Text style={styles.subText}>{method.sub}</Text>
                )}
              </View>
              <Ionicons
                name={
                  selected === method.id
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Nút thanh toán */}
      <TouchableOpacity style={styles.payNowBtn} onPress={handlePayment} onPressOut={() => router.replace('/(tabs)/home')}>
        <Text style={styles.payNowText}>Thanh toán ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00639B',
  },
  closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  dropdownBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
  },
  promoBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginBottom: 16,
    gap: 6,
  },
  promoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    gap: 12,
  },
  labelGroup: {
    flex: 1,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  subText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: '#0288D1',
    paddingVertical: 16,
    margin: 16,
    borderRadius: 50,
  },
  payNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
