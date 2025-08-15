import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
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
        <Image source={item.image} style={styles.image} resizeMode="cover" />
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
    width: ITEM_WIDTH,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
});

export default ImageCarouselCard;
