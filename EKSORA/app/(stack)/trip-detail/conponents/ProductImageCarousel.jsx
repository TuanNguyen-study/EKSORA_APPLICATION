// app/(stack)/trip-detail/components/ProductImageCarousel.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const ProductImageCarousel = ({
  images,
  isFavorite,
  onBackPress,
  onSharePress,
  onFavoritePress,
  onImagePress, // Callback khi nhấn vào ảnh (để xem full)
}) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (!images || images.length === 0) {
    // Fallback nếu không có ảnh
    return (
      <View style={[styles.carouselContainer, styles.noImageContainer]}>
        <TouchableOpacity onPress={onBackPress} style={[styles.iconButton, styles.backButton, { top: insets.top + 10 }]}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Ionicons name="image-outline" size={100} color={COLORS.border} />
      </View>
    );
  }

  const renderImageItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onImagePress && onImagePress(item.id)}>
      <ImageBackground source={{ uri: item.uri }} style={styles.imageBackground} resizeMode="cover">
        {/* Có thể thêm overlay gradient ở đây nếu muốn */}
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />

      {/* Action Buttons */}
      <TouchableOpacity
        onPress={onBackPress}
        style={[styles.iconButton, styles.backButton, { top: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}
      >
        <Ionicons name="arrow-back" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <View style={[styles.topRightButtonsContainer, { top: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}>
        <TouchableOpacity onPress={onSharePress} style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={26} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onFavoritePress} style={styles.iconButton}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={26} color={isFavorite ? COLORS.danger : COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                currentIndex === index ? styles.paginationDotActive : styles.paginationDotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: screenWidth,
    height: screenWidth * 0.8, // Tỷ lệ chiều cao ảnh, có thể điều chỉnh
    backgroundColor: COLORS.border, // Màu nền khi ảnh chưa load
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    width: screenWidth,
    height: '100%',
  },
  imageBackground: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'flex-end', // Để pagination ở dưới nếu muốn
  },
  iconButton: {
    position: 'absolute',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Nền mờ cho dễ thấy
  },
  backButton: {
    left: 15,
  },
  topRightButtonsContainer: {
    position: 'absolute',
    right: 15,
    flexDirection: 'row',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.white,
    width: 12, // Chấm active to hơn
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default ProductImageCarousel;