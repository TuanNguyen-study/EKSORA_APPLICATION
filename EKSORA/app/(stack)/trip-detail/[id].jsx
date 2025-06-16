import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
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
import CustomerReviewSection from './components/CustomerReviewSection';
import PolicyInfoSection from './components/PolicyInfoSection';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductOptionSelector from './components/ProductOptionSelector';
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

  const loadTourDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      // 1) Gọi API, trả về { tour, services[], highlights[], reviews[] }
      const { tour, services = [], highlights = [], reviews = [] } = await fetchTourDetail(id);

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

      // 3) Map reviews về UI-ready
      const mappedReviews = reviews.map(r => ({
        _id: r._id,
        userName: r.user?.id?.name || 'Khách ẩn danh',
        userAvatar: r.user?.id?.avatarUrl || null,
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.created_at).toLocaleDateString('vi-VN'),
      }));

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
        availableDateFilters: [],    // nếu có API trả thêm thì map tương tự
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
      console.error('🛑 Lỗi khi lấy chi tiết tour:', e);
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
          onBackPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(tabs)/home')
          }
          onSharePress={() => Alert.alert('Chia sẻ', 'Tính năng đang phát triển')}
          onFavoritePress={() => {
            setIsFavorite(v => !v);
            Alert.alert(isFavorite ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích');
          }}
        />

        <View style={styles.mainContentContainer}>
          <ProductBasicInfo
            productInfo={productData}
            onSeeAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
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

          <View style={styles.separator} />

          <ProductOptionSelector
            servicePackages={productData.availableServicePackages}
            dateFilters={productData.availableDateFilters}
            initialTotalPrice={productData.price.current}
            onSelectionUpdate={(map, total) => setCurrentTotalPrice(total)}
          />

          <CustomerReviewSection
            reviews={productData.reviews}
            averageRating={productData.rating.stars}
            totalReviewsCount={productData.rating.count}
            onViewAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
          />

          <PolicyInfoSection
            noteTitle={productData.tripNotes?.title}
            notes={productData.tripNotes?.items || []}
            contactInfo={productData.contactInformation}
            onChatPress={() => Alert.alert('Chat')}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <StickyBookingFooter priceInfo={{
        ...productData.price,
        current: currentSelectedPackages.totalPrice || productData.price.current
      }}
        tourName={productData.name} // Truyền tên tour vào
 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.background || '#f5f5f5', padding: 20
  },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
  errorText: { fontSize: 16, color: COLORS.danger, textAlign: 'center', marginTop: 10 },
  retryButton: {
    marginTop: 20, backgroundColor: COLORS.primary,
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8
  },
  retryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  mainContentContainer: {
    paddingHorizontal: 16, backgroundColor: COLORS.white,
    marginTop: -10, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 30
  },
  separator: {
    height: 1, backgroundColor: COLORS.background,
    marginVertical: 15, marginHorizontal: -16
  }
});
