import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import Header from '../../../components/offers/header';
import Offer from '../../../components/offers/Offer';
import Promotions from '../../../components/offers/Promotion';

// Tạo một mảng chứa các "phần" của màn hình.
const SCREEN_COMPONENTS = [
  { id: 'header', Component: Header },
  { id: 'offer', Component: Offer },
  { id: 'promotions', Component: Promotions },
];

const IndexScreen = () => {

  // Nó chỉ đơn giản là render component tương ứng.
  const renderItem = ({ item }) => {
    // Lấy component từ item và render nó
    const { Component } = item;
    return <Component />;
  };

  return (
    // Dùng View làm container chính cho toàn bộ màn hình
    <View style={styles.container}>
      <FlatList
        data={SCREEN_COMPONENTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 20, paddingBottom: 30 }} />}
        // Thêm khoảng trống ở đầu nếu cần
        ListHeaderComponent={<View style={{ height: 10 }} />}
      />
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});