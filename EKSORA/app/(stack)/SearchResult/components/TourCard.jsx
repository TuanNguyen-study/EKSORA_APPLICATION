import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";


const { width } = Dimensions.get("window");

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
});

export default function TourCard({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, cardShadow]}>
        <Image source={{ uri: item.image[0] }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.category}>Sự kiện & Show diễn - {item.province}</Text>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.confirm}>Miễn phí huỷ · Xác nhận tức thời</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.booked}>60K+ Đã được đặt</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Từ ₫ {item.price.toLocaleString()}</Text>
            <Text style={styles.oldPrice}>₫ {(item.price * 1.2).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: width * 0.5,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  cardContent: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  confirm: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    fontSize: 13,
    color: COLORS.primary,
  },
  review: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: "#999",
  },
  booked: {
    fontSize: 12,
    color: "#666",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    color: COLORS.primaryBlue,
    fontWeight: "bold",
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
  },
});
