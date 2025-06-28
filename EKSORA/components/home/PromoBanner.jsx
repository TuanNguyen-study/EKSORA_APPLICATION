import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CouponModal from '../../app/(stack)/Voucher/CouponModal'; 

const PromoBanner = () => {
  const [modalVisible, setModalVisible] = useState(false); // State để quản lý Modal

  return (
    <>
      <View style={styles.container}>
        {/* Icon bên trái */}
        <Ionicons name="flame" size={32} color="#0087CA" style={styles.icon} />

        {/* Khối văn bản ở giữa */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Mã Ngon Giảm Sốc</Text>
          <Text style={styles.subtitle}>Có hạn, dùng ngay!</Text>
        </View>

        {/* Nút bên phải */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)} // Mở Modal khi nhấn
        >
          <Text style={styles.buttonText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Gọi CouponModal */}
      <CouponModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Đóng Modal
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginBottom: 10,
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
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#0087CA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PromoBanner;