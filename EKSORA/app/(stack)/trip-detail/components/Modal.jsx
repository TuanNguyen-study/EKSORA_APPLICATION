import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors'; // hoặc bạn thay bằng mã màu trực tiếp nếu không dùng constants

const BookingModalContent = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState('16/5');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const adultPrice = 747000;
  const childPrice = 605745;

  const totalPrice = adults * adultPrice + children * childPrice;

  const formatPrice = (price) => price.toLocaleString('vi-VN');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tùy chọn đơn hàng</Text>
        <View style={{ width: 24 }} /> {/* Để giữ cân đối */}
      </View>

      {/* Nội dung */}
      <ScrollView style={styles.content}>
        {/* Tên tour */}
        <View style={styles.tourInfo}>
          <Text style={styles.tourName}>
            Combo Khách Sạn 4 Sao + Vé Máy Bay Đà Nẵng Hội An - 4 Ngày 3 Đêm
          </Text>
          <TouchableOpacity>
            <Text style={styles.detailsLink}>Chi tiết</Text>
          </TouchableOpacity>
        </View>

        {/* Chọn ngày */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Xin chọn ngày tham gia</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateRange}>Xem trạng thái dịch vụ</Text>
            <Text style={styles.dateRange}>16/5 - 31/12</Text>
          </View>
          <View style={styles.dateOptions}>
            {['16/5', '17/5', '18/5', '19'].map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  selectedDate === date && styles.selectedDateButton,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === date && styles.selectedDateText,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Người lớn + trẻ em */}
        <View style={styles.section}>
          {/* Người lớn */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Người lớn</Text>
            <Text style={styles.quantityPrice}>đ {formatPrice(adultPrice)}</Text>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => setAdults(Math.max(adults - 1, 0))}
            >
              <Text style={styles.circleButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{adults}</Text>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => setAdults(adults + 1)}
            >
              <Text style={styles.circleButtonText}>＋</Text>
            </TouchableOpacity>
          </View>

          {/* Trẻ em */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Trẻ em(5-8)</Text>
            <Text style={styles.quantityPrice}>đ {formatPrice(childPrice)}</Text>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => setChildren(Math.max(children - 1, 0))}
            >
              <Text style={styles.circleButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{children}</Text>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => setChildren(children + 1)}
            >
              <Text style={styles.circleButtonText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>đ {formatPrice(totalPrice)}</Text>
        <TouchableOpacity style={styles.bookNowBtn}>
          <Text style={styles.bookNowText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tourInfo: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tourName: {
    fontWeight: 'bold',
    flex: 1,
  },
  detailsLink: {
    color: COLORS.primary || '#007AFF',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRange: {
    color: '#666',
    fontSize: 12,
  },
  dateOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  dateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selectedDateButton: {
    backgroundColor: COLORS.primary || '#007AFF',
  },
  dateText: {
    fontWeight: '500',
  },
  selectedDateText: {
    color: '#fff',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  quantityLabel: {
    flex: 1,
    fontSize: 14,
  },
  quantityPrice: {
    width: 80,
    textAlign: 'right',
    marginRight: 8,
    fontWeight: 'bold',
  },
  quantityValue: {
    width: 24,
    textAlign: 'center',
  },
  circleButton: {
    width: 30,
    height: 30,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookNowBtn: {
    backgroundColor: COLORS.primary || '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
