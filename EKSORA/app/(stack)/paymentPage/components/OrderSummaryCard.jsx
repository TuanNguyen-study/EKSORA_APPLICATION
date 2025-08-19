import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

const OrderSummaryCard = ({ items, contactInfo, styles }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCart = items.length > 1;

  const renderItemDetails = (item, index) => (
    <View key={item.id || index} style={index > 0 ? { marginTop: 12 } : {}}>
      <Text style={styles.detailTitle}>
        {item.title || item.name || `Sản phẩm ${index + 1}`}
      </Text>
      <Text style={styles.detailText}>Ngày đi: {item.travelDate || "N/A"}</Text>
      <Text style={styles.detailText}>
        Số lượng: {item.quantityAdult || item.adults} người lớn,{" "}
        {item.quantityChild || item.children} trẻ em
      </Text>
      {isCart && index < items.length - 1 && (
        <View style={styles.itemSeparator} />
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.cardTitle}>
          {isCart
            ? `Thông tin đơn hàng (${items.length} tour)`
            : "Thông tin đơn hàng"}
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={22}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.cardContent}>
          {items.map((item, index) => renderItemDetails(item, index))}
          <View style={styles.separator} />
          <Text style={styles.detailTitle}>Thông tin liên lạc</Text>
          <Text style={styles.detailText}>{contactInfo.fullName}</Text>
          <Text style={styles.detailText}>{contactInfo.email}</Text>
          <Text style={styles.detailText}>{contactInfo.phone}</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(OrderSummaryCard);
