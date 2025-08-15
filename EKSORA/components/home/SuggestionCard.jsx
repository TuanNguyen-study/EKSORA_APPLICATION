import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.42;
const IMAGE_HEIGHT = CARD_WIDTH * (2.5 / 4);

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300";

const SuggestionCard = ({ item, onPress }) => {
  // ép kiểu image luôn là string
  let imageUrl = PLACEHOLDER_IMAGE;
  if (item?.image) {
    if (Array.isArray(item.image)) {
      imageUrl = item.image[0] || PLACEHOLDER_IMAGE;
    } else if (typeof item.image === "string") {
      imageUrl = item.image;
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} />

      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}%</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FACC15" />
          <Text style={styles.ratingText}>
            {Number.isInteger(Number(item.rating))
              ? `${item.rating}.0`
              : item.rating}
          </Text>
        </View>

        <Text style={styles.currentPrice}>
          Từ {item.price ? item.price.toLocaleString("vi-VN") : "0"}đ
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 0.1,
    marginBottom: 20,
    marginHorizontal: 7,
    shadowColor: "#a19b9bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    width: CARD_WIDTH,
  },
  cardImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  currentPrice: {
    fontSize: 15,
    color: COLORS.primary,
  },
});

export default SuggestionCard;
