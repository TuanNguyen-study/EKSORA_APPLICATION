import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import OfferCard from '../../../components/offers/OfferCard';

const offers = [
  { id: '1', title: 'Giảm 20% vé máy bay', description: 'Áp dụng cho các chuyến đi trong tháng 6' },
  { id: '2', title: 'Tour Đà Lạt chỉ 2 triệu', description: 'Khởi hành hàng tuần' },
];

export default function OffersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ưu đãi đặc biệt</Text>
      <FlatList
        data={offers}
        renderItem={({ item }) => <OfferCard offer={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
});