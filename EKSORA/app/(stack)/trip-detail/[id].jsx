import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchTourDetail } from '../../../API/services/tourService';
import { COLORS } from '../../../constants/colors';
import CustomerReviewSection from './components/CustomerReviewSection';
import NoteContactSection from './components/NoteContactSection';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageCarousel from './components/ProductImageCarousel';
import { default as ProductOptionSelector } from './components/ProductOptionSelector';
import StickyBookingFooter from './components/StickyBookingFooter';
import TripHighlightsSection from './components/TripHighlightsSection';


export default function TripDetailScreen() {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState({});
  const [currentTotalPrice, setCurrentTotalPrice] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalExtraPrice, setTotalExtraPrice] = useState(0);
  const loadTourDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      // 1) Gọi API, trả về { tour, services[], highlights[], reviews[] }
      const { tour, services = [], highlights = [], reviews = [] } = await fetchTourDetail(id);
      console.log(' tour:', tour);
      if (!tour || !tour._id) {
        throw new Error('Dữ liệu tour không hợp lệ.');
      }

      // 2) Map services thành cấu trúc cho selector
      const availableServicePackages = services.map(svc => ({
        id: svc._id,
        title: svc.title || svc.name,
        options: (svc.options || []).map(opt => ({
          id: opt._id,
          name: opt.name,
          description: opt.description,
          price: opt.price_extra,
        }))
      }));
      console.log(' reviews raw:', reviews);
      // 3) Map reviews về UI-ready
      const mappedReviews = reviews.map(r => {
        console.log(' Review raw:', r);
        const hasValidName =
          (r.user?.first_name && r.user?.first_name.trim()) ||
          (r.user?.last_name && r.user?.last_name.trim());

        return {
          _id: r._id,
          userName: hasValidName
            ? `${r.user?.first_name?.trim() || ''} ${r.user?.last_name?.trim() || ''}`.trim()
            : r.user_name || 'Khách ẩn danh',
          userAvatar: r.user?.avatarUrl || null,
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.created_at).toLocaleDateString('vi-VN'),
        };
      });

      // 4) Tạo productData
      const mappedProductData = {
        ...tour,
        images: (tour.image || []).map((uri, i) => ({ id: `img_${i}`, uri })),
        price: {
          current: tour.price ?? 0,
          original: tour.price ?? 0,
          currency: 'đ',
          unit: 'người',
        },
        rating: {
          stars: tour.rating ?? 0,
          count: mappedReviews.length,
        },
        availableServicePackages,
        availableDateFilters: [],
        descriptionContent: [
          { type: 'text', content: tour.description || '' }
        ],
        reviews: mappedReviews,
        tripNotes: tour.tripNotes || null,
        contactInformation: tour.contactInformation || null,
        services,
        highlights,
      };

      setProductData(mappedProductData);
      setCurrentTotalPrice(mappedProductData.price.current);

    } catch (e) {
      console.error('Lỗi khi lấy chi tiết tour:', e);
      setError(e.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (productId) loadTourDetails(productId);
  }, [productId, loadTourDetails]);

  const onRefresh = () => {
    if (productId) {
      setRefreshing(true);
      loadTourDetails(productId);
    }
  };
  const onBookNow = () => {
    const basePrice = productData?.price?.current || 0;

    // Tính tổng giá phụ thu option
    const optionTotal = Object.values(currentSelectedPackages).reduce((sum, optId) => {
      for (const pkg of productData.availableServicePackages) {
        const option = pkg.options.find(opt => opt.id === optId);
        if (option) return sum + (option.price || 0);
      }
      return sum;
    }, 0);




    const total_price = basePrice + optionTotal;

    const query = new URLSearchParams({
      tour_id: productData._id,
      tour_title: productData.name,
      total_price: total_price.toString(),
      selectedOptions: JSON.stringify(currentSelectedPackages),
    }).toString();

    router.push(`/acount/bookingScreen?${query}`);
    console.log(' Booking URL:', `/acount/bookingScreen?${query}`);
  };



  if (loading && !productData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết chuyến đi...</Text>
      </View>
    );
  }

  if (error && !productData) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Lỗi' }} />
        <Ionicons name="cloud-offline-outline" size={60} color={COLORS.textSecondary} />
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity onPress={() => loadTourDetails(productId)} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ProductImageCarousel
          images={productData.images}
          isFavorite={isFavorite}
          tourId={productData._id}
          onBackPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}
          onSharePress={() => Alert.alert('Chia sẻ', 'Tính năng đang phát triển')}
          onFavoritePress={() => setIsFavorite(prev => !prev)}
        />




        <View style={styles.mainContentContainer}>
          <ProductBasicInfo
            productInfo={productData}
            onSeeAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
          />

          <View style={styles.separator} />


          <ProductOptionSelector
            servicePackages={productData.availableServicePackages}
            dateFilters={productData.availableDateFilters}
            initialTotalPrice={productData.price.current}
            onSelectionUpdate={(map, totalExtra) => {
              setCurrentSelectedPackages(map);
              setCurrentTotalPrice((productData?.price?.current || 0) + totalExtra);
            }}
            title=""
          />
          <CustomerReviewSection
            reviews={productData.reviews}
            averageRating={productData.rating.stars}
            totalReviewsCount={productData.rating.count}
            onViewAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
          />

          <TripHighlightsSection
            title="Địa điểm nổi bật trong tour"
            highlights={productData.highlights.map(h => ({
              _id: h._id,
              image: h.image_url,
              title: h.location_name,
              description: h.description,
            }))}
          />

          <NoteContactSection />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <StickyBookingFooter
        priceInfo={{
          ...productData.price,
          current: currentTotalPrice,
        }}
        onBookNow={onBookNow}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background || '#f5f5f5', padding: 20
  },

  loadingText:
  {
    marginTop:
      10, fontSize:
      16, color: COLORS.textSecondary
  },

  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 10
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold'
  },

  mainContentContainer: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    marginTop: -10, borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 15,
    marginHorizontal: -16
  }
});