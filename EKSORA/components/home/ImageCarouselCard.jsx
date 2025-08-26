import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_PREVIEW_WIDTH = width * 0.1;
const CARD_WIDTH = width - CARD_PREVIEW_WIDTH * 2 - 20;
const ITEM_WIDTH = width * 0.6;
const ITEM_SPACING = 15;

const ImageCarouselCard = ({ item, isActive = false }) => {
  const router = useRouter();
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isActive ? 1 : 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const handlePress = () => {
    if (item.tourData?._id) {
      // Chuyển đến trang chi tiết tour
      router.push(`/(stack)/trip-detail/${item.tourData._id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.card,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={item.image || require("../../assets/images/Logo.png")}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Overlay với thông tin category và "Xem thêm" */}
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "transparent", "rgba(0,0,0,0.5)"]}
          style={styles.overlay}
        >
          <View style={styles.categoryContainer}>
            <MaterialIcons
              name="location-on"
              size={14}
              color="white"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.categoryText}>
              {item.tourData?.cateID?.name ||
                item.tourData?.location ||
                "Du lịch"}
            </Text>
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.viewMoreText}>Xem thêm</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: ITEM_WIDTH,
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: COLORS.border,
    marginHorizontal: ITEM_SPACING / 2,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    padding: 12,
  },
  categoryContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomInfo: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    opacity: 0.8,
  },
  viewMoreText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
  },
});

export default ImageCarouselCard;
