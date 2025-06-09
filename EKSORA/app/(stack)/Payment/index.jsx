import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });



  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} />
        <Text style={styles.headerTitle}>Hoàn tất đơn hàng</Text>
      </View>

      {/* Tour Info */}
      <View style={styles.card}>
        <Text style={styles.tourTitle}>
          Tour Tham Quan Ninh Bình Trong Ngày, Khởi Hành Từ Thành Phố Hồ Chí Minh
        </Text>
        <Text style={styles.grayText}>Vé tiêu chuẩn</Text>
        <Text style={styles.grayText}>16/5/2025</Text>
        <Text style={styles.grayText}>Người lớn x1</Text>
        <Text style={styles.tourPrice}>₫ 747,000</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="information-circle-outline" size={18} color="#2196F3" />
          <Text style={styles.sectionTitle}>Thông tin liên lạc:</Text>
        </View>
        <Text style={styles.subText}>
          Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn
        </Text>

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.link}>+ Thêm</Text>
        </TouchableOpacity>

        {/* Các trường thông tin */}
        <View style={styles.inputRow}>
          <Text style={styles.infoText}>Họ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập"
            value={contactInfo.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.infoText}>Tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập"
            value={contactInfo.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.infoText}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập"
            value={contactInfo.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.rowBetween}>
          <View style={[styles.inputRow, { flex: 1 }]}>
            <Text style={styles.infoText}>Địa chỉ email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập"
              value={contactInfo.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
            />
          </View>
          {contactInfo.email ? (
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.link, { marginLeft: 8 }]}>Chỉnh sửa</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Discount Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Giảm giá</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.grayText}>Mã ưu đãi nền tảng</Text>
          <Text style={styles.grayText}>Không khả dụng</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.grayText}>Mã ưu đãi thanh toán</Text>
          <Text style={styles.grayText}>Không khả dụng</Text>
        </View>
      </View>

      {/* Terms */}
      <Text style={styles.termsText}>
        Tôi đã hiểu và đồng ý với <Text style={styles.underline}>Điều Khoản Sử Dụng Chung</Text> và <Text style={styles.underline}>Chính Sách Quyền riêng tư của ESROSA</Text>
      </Text>

      {/* Notice */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Xin điền thông tin cần thiết. Thông tin đã gởi sẽ không thể thay đổi.
        </Text>
      </View>

      {/* Total + Pay */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.totalText}>₫ 747,000</Text>
          <Text style={styles.discountText}>Giảm 64,000₫</Text>
        </View>
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payBtnText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Shadow cho iOS và Android
const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    flex: 1,
  },
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...cardShadow,
  },
  sectionTitle: {
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 6,
    marginBottom: 8,
  },
  tourTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  grayText: {
    color: '#666',
    marginBottom: 2,
  },
  tourPrice: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 10,
  },
  subText: {
    color: '#777',
    fontSize: 13,
    marginBottom: 8,
  },
  link: {
    color: '#2196F3',
    fontWeight: '600',
  },
  placeholder: {
    color: '#aaa',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  noticeBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  noticeText: {
    color: '#1976d2',
    fontSize: 13,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  discountText: {
    color: 'green',
    fontWeight: '600',
  },
  payBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 16,
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
    minWidth: 150,
    textAlign: 'right',
    flex: 1,
    color: '#000',
  },
});
