// file: components/ProductDetail/ProductImageCarousel.js

import { COLORS } from "../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import ShareModal from "./ShareModal";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = screenWidth;
const SNAP_INTERVAL = ITEM_WIDTH;

const ProductImageCarousel = ({
  images = [],
  tourData,
  isFavorited, // THAY ĐỔI: Nhận trạng thái yêu thích từ prop
  isShareModalVisible, // THAY ĐỔI: Nhận trạng thái hiển thị modal từ prop
  onBackPress,
  onSharePress, // Sẽ sử dụng prop này
  onFavoritePress, // Sẽ sử dụng prop này
  onCloseShareModal, // THAY ĐỔI: Nhận hàm đóng modal từ prop
  onCartPress,
  onImagePress,
}) => {
  // --- XÓA BỎ LOGIC KHÔNG CẦN THIẾT ---
  // const { likedTours, addFavorite, removeFavorite } = useContext(FavoriteContext); // Không cần tự xử lý nữa
  // const [showShareModal, setShowShareModal] = useState(false); // State này sẽ được quản lý bởi component cha

  const loopedImages = [...images, ...images, ...images];
  const initialIndex = images.length;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);
  const router = useRouter();

  // Auto scroll carousel
  useEffect(() => {
    if (!flatListRef.current || loopedImages.length === 0) return;
    flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
  }, [loopedImages.length]);

  useEffect(() => {
    if (isManuallyScrolling) return;

    const timer = setInterval(() => {
      if (!flatListRef.current) return;
      let nextIndex = currentIndex + 1;
      if (nextIndex >= loopedImages.length - 1) {
        nextIndex = initialIndex;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: false,
        });
      } else {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, isManuallyScrolling]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onImagePress?.(item.id)}
    >
      {item.uri ? (
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, { backgroundColor: COLORS.border }]} />
      )}
    </TouchableOpacity>
  );

  const renderPagination = () => {
    const activeIndex = currentIndex % images.length;
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, i) => (
          <View
            key={`dot-${i}`}
            style={[
              styles.paginationDotBase,
              i === activeIndex
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  // --- HÀM ĐÃ ĐƯỢC ĐƠN GIẢN HÓA HOẶC XÓA BỎ ---
  // const handleFavoritePress = ... // Xóa hàm này
  // const handleSharePress = ... // Xóa hàm này
  // const handleCloseShareModal = ... // Xóa hàm này

  const handleCartPress = () => {
    router.push("/(stack)/ShoppingCartScreen");
  };

  if (!images || images.length === 0) {
    // ... (không thay đổi phần này)
    return (
        <View style={[styles.carouselContainer, styles.noImageContainer]}>
          <TouchableOpacity
            onPress={onBackPress}
            style={[styles.iconButtonBase, styles.backButton]}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Ionicons name="image-outline" size={100} color={COLORS.border} />
        </View>
      );
  }

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={loopedImages}
        keyExtractor={(item, index) => `${item?.id || "image"}-${index}`}
        horizontal
        // ... (các props khác của FlatList không đổi)
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setIsManuallyScrolling(true)}
        onMomentumScrollEnd={() =>
          setTimeout(() => setIsManuallyScrolling(false), 500)
        }
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
        }}
      />

      <View style={styles.headerActionsContainer}>
        <TouchableOpacity onPress={onBackPress} style={styles.iconButtonBase}>
          <Ionicons name="arrow-back" size={26} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.rightHeaderActions}>
          {/* THAY ĐỔI: Gọi trực tiếp prop onFavoritePress */}
          <TouchableOpacity
            onPress={onFavoritePress}
            style={styles.iconButtonBase}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={isFavorited ? COLORS.danger : COLORS.white}
            />
          </TouchableOpacity>

          {/* THAY ĐỔI: Gọi trực tiếp prop onSharePress */}
          <TouchableOpacity
            onPress={onSharePress}
            style={styles.iconButtonBase}
            activeOpacity={0.7}
          >
            <Ionicons
              name="share-social-outline"
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCartPress} // Giữ nguyên vì không liên quan đến logic đăng nhập
            style={styles.iconButtonBase}
          >
            <Ionicons name="cart-outline" size={26} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {images.length > 1 && renderPagination()}

      {/* THAY ĐỔI: Điều khiển modal thông qua props */}
      {tourData && (
        <ShareModal
          visible={isShareModalVisible}
          onClose={onCloseShareModal}
          tourData={tourData}
        />
      )}
    </View>
  );
};

// ... (styles không thay đổi)
const styles = StyleSheet.create({
    carouselContainer: {
      position: "relative",
      width: "100%",
      height: 300,
    },
    noImageContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.background,
    },
    image: {
      width: ITEM_WIDTH,
      height: "100%",
    },
    headerActionsContainer: {
      position: 'absolute',
      top: 35,
      left: 10,
      right: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rightHeaderActions: {
      flexDirection: "row",
    },
    iconButtonBase: {
      padding: 8,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 20,
      marginHorizontal: 5,
    },
    backButton: {
      backgroundColor: "rgba(255,255,255,0.9)",
    },
    paginationContainer: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    paginationDotBase: {
      width: 64,
      height: 3,
      borderRadius: 1,
      marginHorizontal: 4,
      marginBottom: 16,
    },
    paginationDotActive: {
      backgroundColor: COLORS.primary,
    },
    paginationDotInactive: {
      backgroundColor: "rgba(255,255,255,0.5)",
    },
    disabledButton: {
      opacity: 0.6,
    },
  });

export default ProductImageCarousel;