import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const PromoBanner = () => (
  <View style={styles.container}>
    {/* Icon bên trái */}
    <Ionicons name="flame" size={32} color='#0087CA' style={styles.icon} />

    {/* Khối văn bản ở giữa */}
    <View style={styles.textContainer}>
      <Text style={styles.title}>Mã Ngon Giảm Sốc</Text>
      <Text style={styles.subtitle}>Có hạn, dùng ngay!</Text>
    </View>

    {/* Nút bên phải */}
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Xem tất cả</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3FA', // Màu nền be/cam nhạt
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 15, // Khoảng cách với lề màn hình
    marginBottom:10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1, // Giúp khối này chiếm hết không gian còn lại
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Màu chữ đậm
  },
  subtitle: {
    fontSize: 13,
    color: '#757575', // Màu chữ xám nhạt
    marginTop: 2,
  },
  button: {
    backgroundColor: '#0087CA', // Màu cam đậm cho nút
    borderRadius: 20, // Bo tròn để tạo hình viên thuốc
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF', // Chữ trắng
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PromoBanner;