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
import { addFavoriteTour, deleteFavoriteTour, getFavoriteToursByUser } from '../../../../API/services/servicesFavorite';


const { width: screenWidth } = Dimensions.get('window');

const ITEM_WIDTH = screenWidth * 1;
const SNAP_INTERVAL = ITEM_WIDTH;
const getFavoriteKey = (tourId) => `favorite_tour_${tourId}`;


const ProductImageCarousel = ({
  images = [],
  isFavorite: initialIsFavorite,
  tourId, 
  onBackPress,
  onSharePress,
  onFavoritePress,
  onAudioGuidePress,
  onCartPress,
  onImagePress,
}) => {
  const loopedImages = [...images, ...images, ...images];
  const initialIndex = images.length;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("USER_ID");
        if (!userId || !tourId) return;

        // Ưu tiên lấy từ local storage
        const localValue = await AsyncStorage.getItem(getFavoriteKey(tourId));
        if (localValue !== null) {
          setIsFavorite(JSON.parse(localValue));
          return;
        }

        // Nếu chưa có local thì gọi API
        const res = await getFavoriteToursByUser(userId);
        const favoriteTours = res.data || [];
        const isFav = favoriteTours.some((item) => item.tourId === tourId);
        setIsFavorite(isFav);
        await AsyncStorage.setItem(getFavoriteKey(tourId), JSON.stringify(isFav));
      } catch (err) {
        console.log('Lỗi khi kiểm tra yêu thích:', err.message);
      }
    };

    fetchFavoriteStatus();
  }, [tourId]);


  useEffect(() => {
    if (flatListRef.current && loopedImages.length > 0) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [initialIndex, loopedImages.length]);

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
  }, [currentIndex, isManuallyScrolling, initialIndex, loopedImages.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index ?? initialIndex;
      setCurrentIndex(visibleIndex);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleScrollBeginDrag = () => setIsManuallyScrolling(true);
  const handleScrollEndDrag = () => {
    setTimeout(() => setIsManuallyScrolling(false), 500);
  };

  const handleFavoritePress = async () => {
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!userId || !token || !tourId) {
        Alert.alert('Lỗi', 'Bạn cần đăng nhập hoặc thông tin tour không hợp lệ.');
        return;
      }

      if (isFavorite) {
        // Xóa khỏi danh sách yêu thích
        await deleteFavoriteTour(userId, tourId, token);
        setIsFavorite(false);
        await AsyncStorage.setItem(getFavoriteKey(tourId), JSON.stringify(false));
        //Alert.alert('Thành công', 'Đã xóa khỏi danh sách yêu thích');
      } else {
        // Thêm vào danh sách yêu thích
        await addFavoriteTour(userId, tourId);
        setIsFavorite(true);
        await AsyncStorage.setItem(getFavoriteKey(tourId), JSON.stringify(true));
        //Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích');
      }

      if (onFavoritePress) onFavoritePress();
    } catch (err) {
      console.error('Lỗi khi xử lý yêu thích:', err.response?.data || err.message);
      Alert.alert('Lỗi', err.response?.data?.message || 'Vui lòng thử lại sau');
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onImagePress && onImagePress(item.id)}>
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
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
        }}
        renderItem={renderItem}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
      />

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
    borderRadius: 0,
  },
  headerActionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    alignItems: 'center',
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