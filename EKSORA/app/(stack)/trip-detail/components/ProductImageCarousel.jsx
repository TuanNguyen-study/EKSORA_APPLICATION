import { COLORS } from '../../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addFavoriteTour,
  deleteFavoriteTour,
  getFavoriteToursByUser,
} from '../../../../API/services/servicesFavorite';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth;
const SNAP_INTERVAL = ITEM_WIDTH;

const getFavoriteKey = (tourId) => `favorite_tour_${tourId}`;

const ProductImageCarousel = ({
  images = [],
  tourId,
  onBackPress,
  onSharePress,
  onFavoritePress,
  onCartPress,
  onImagePress,
}) => {
  const loopedImages = [...images, ...images, ...images];
  const initialIndex = images.length;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load trạng thái yêu thích từ local + server
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('USER_ID');
        if (!userId || !tourId) return;

        const localValue = await AsyncStorage.getItem(getFavoriteKey(tourId));
        if (localValue !== null) {
          setIsFavorite(JSON.parse(localValue));
        } else {
          const res = await getFavoriteToursByUser(userId);
          const favoriteTours = res?.data || [];
          const isFav = favoriteTours.some((item) => item.tourId === tourId);
          setIsFavorite(isFav);
          await AsyncStorage.setItem(getFavoriteKey(tourId), JSON.stringify(isFav));
        }
      } catch (error) {
        console.log('Lỗi khi load yêu thích:', error.message);
      }
    };

    fetchFavoriteStatus();
  }, [tourId]);

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
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: false });
      } else {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, isManuallyScrolling]);

  // Xử lý yêu thích
  const handleFavoritePress = async () => {
    try {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      const userId = await AsyncStorage.getItem('USER_ID');

      if (!userId || !token || !tourId) {
        Alert.alert('Lỗi', 'Thiếu thông tin người dùng hoặc tour.');
        return;
      }

      if (isFavorite) {
        await deleteFavoriteTour(userId, tourId, token);
        setIsFavorite(false);
        await AsyncStorage.setItem(getFavoriteKey(tourId), JSON.stringify(false));
      } else {
        await addFavoriteTour(userId, tourId);
        setIsFavorite(true);
        await AsyncStorage.setItem(getFavoriteKey(tourId), JSON.stringify(true));
      }

      if (onFavoritePress) onFavoritePress();
    } catch (error) {
      console.error('Lỗi yêu thích:', error.response?.data || error.message);
      Alert.alert('Lỗi', error.response?.data?.message || 'Vui lòng thử lại sau.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onImagePress?.(item.id)}>
      {item.uri ? (
        <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
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
              i === activeIndex ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.carouselContainer, styles.noImageContainer]}>
        <TouchableOpacity onPress={onBackPress} style={[styles.iconButtonBase, styles.backButton]}>
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
        keyExtractor={(item, index) => `${item?.id || 'image'}-${index}`}
        horizontal
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setIsManuallyScrolling(true)}
        onMomentumScrollEnd={() => setTimeout(() => setIsManuallyScrolling(false), 500)}
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

      {/* Header actions */}
      <View style={styles.headerActionsContainer}>
        <TouchableOpacity onPress={onBackPress} style={styles.iconButtonBase}>
          <Ionicons name="arrow-back" size={26} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.rightHeaderActions}>
          <TouchableOpacity onPress={handleFavoritePress} style={styles.iconButtonBase}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? COLORS.danger : COLORS.white}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onSharePress} style={styles.iconButtonBase}>
            <Ionicons name="share-social-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onCartPress} style={styles.iconButtonBase}>
            <Ionicons name="cart-outline" size={26} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {images.length > 1 && renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: screenWidth,
    height: screenWidth * 0.8,
    backgroundColor: COLORS.border,
    overflow: 'visible',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: ITEM_WIDTH,
    height: '100%',
  },
  headerActionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  iconButtonBase: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginHorizontal: 4,
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  paginationDotBase: {
    width: 75,
    height: 2.5,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
  },
  paginationDotInactive: {
    backgroundColor: COLORS.inactiveTabDot || '#D3D3D3',
  },
});

export default ProductImageCarousel;
