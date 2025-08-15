import { StyleSheet, View, FlatList } from "react-native";

import React from "react";
import Header from "../../../components/offers/components/header";
import Offer from "../../../components/offers/Offer";
import Promotions from "../../../components/offers/components/Promotion";

const IndexScreen = () => {
  // Tạo một mảng chứa các "phần" của màn hình (không bao gồm header).
  const SCREEN_COMPONENTS = [
    { id: "offer", Component: Offer },
    { id: "promotions", Component: Promotions },
  ];

  // Nó chỉ đơn giản là render component tương ứng.
  const renderItem = ({ item }) => {
    // Lấy component từ item và render nó
    const { Component } = item;
    return <Component />;
  };

  return (
    // Dùng View làm container chính cho toàn bộ màn hình
    <View style={styles.container}>
      {/* Header cố định ở trên cùng */}
      <Header />

      {/* Phần nội dung có thể scroll */}
      <FlatList
        data={SCREEN_COMPONENTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 20, paddingBottom: 30 }} />}
        style={styles.scrollableContent}
      />
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollableContent: {
    flex: 1,
  },
});
