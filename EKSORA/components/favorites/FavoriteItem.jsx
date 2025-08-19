import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { FavoriteContext } from "../../store/FavoriteContext";

export default function FavoriteItem({
  id,
  title,
  price,
  image,
  onPress,
  rating,
  reviewCount,
  shortDescription,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const { removeFavorite } = useContext(FavoriteContext);

  const handleRemoveFavorite = async () => {
    try {
      await removeFavorite(id);
      setIsVisible(false);
    } catch (error) {
      console.error("Lỗi khi xoá yêu thích:", error);
    }
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteBox}
      onPress={handleRemoveFavorite}
      activeOpacity={0.7}
    >
      <Text style={styles.deleteText}>Xóa</Text>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  // Nếu ở selection mode, không hiển thị swipe actions
  const content = (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.container, isSelected && styles.selectedContainer]}>
        {/* Checkbox khi ở selection mode */}
        {isSelectionMode && (
          <TouchableOpacity
            onPress={onToggleSelection}
            style={styles.checkboxContainer}
          >
            <Ionicons
              name={isSelected ? "checkbox" : "checkbox-outline"}
              size={24}
              color={isSelected ? "#007bff" : "#ccc"}
            />
          </TouchableOpacity>
        )}

        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          {!isSelectionMode && (
            <View style={styles.heartIconWrapper}>
              <AntDesign name="heart" size={20} color="red" />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {shortDescription || "Không có mô tả."}
            </Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}> {rating}</Text>
              <Text style={styles.reviewText}> ({reviewCount})</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              Từ {price?.toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Chỉ wrap với Swipeable khi không ở selection mode
  if (isSelectionMode) {
    return content;
  }

  return (
    <Swipeable renderRightActions={renderRightActions}>{content}</Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  selectedContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  heartIconWrapper: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a1a1a",
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    minHeight: 32,
    marginTop: 4,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#757575",
  },
  reviewText: {
    color: "#666",
    fontSize: 14,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
  },
  currentPrice: {
    fontSize: 15,
    color: COLORS.primary,
  },
  deleteBox: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 0,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
