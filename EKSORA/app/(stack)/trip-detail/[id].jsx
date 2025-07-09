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
  View,
} from 'react-native';
import { fetchTourDetail } from '../../../API/services/tourService';
import { COLORS } from '../../../constants/colors';
import CustomerReviewSection from './components/CustomerReviewSection';
import NoteContactSection from './components/NoteContactSection';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductOptionSelector from './components/ProductOptionSelector';
import StickyBookingFooter from './components/StickyBookingFooter';
import DescriptionSection from './components/DescriptionSection';
import TripHighlightsSection from './components/TripHighlightsSection';

// Hàm ánh xạ dữ liệu JSON thành productInfo cho ProductBasicInfo
const prepareProductInfo = (tour, services, highlights, reviews) => {
  return {
    name: tour.name,
    departurePoint: tour.province,
    rating: {
      stars: tour.rating || 0,
      count: reviews.length,
      detailsText: `${reviews.length} Đánh giá`,
    },
    tags: [
      { label: 'Lịch sử', isSpecial: false },
      { label: 'Văn hóa', isSpecial: false },
      { label: 'Ẩm thực', isSpecial: true },
    ],
    summaryHighlight: {
      items: highlights.map((item) => item.location_name),
    },
    offers: services.map((service) => ({
      label: service.name || service.title,
      icon: 'pricetag-outline',
      bgColor: '#E6F0FA',
      textColor: '#1E88E5',
    })),
  };
};

// Hàm phân tích tour.description
const parseDescription = (htmlString) => {
  const result = [];
  const seenDescriptions = new Set();

  // Đoạn giới thiệu
  const introMatch = htmlString.match(/<p>(.*?)<\/p>/);
  if (introMatch) {
    result.push({
      type: 'text',
      content: introMatch[1],
    });
  }

  // Tách các cặp hình ảnh và mô tả
  const figureMatches = htmlString.matchAll(/<figure class="image"><img[^>]+src="([^"]+)"[^>]*><\/figure><blockquote><p>(.*?)<\/p><\/blockquote>/g);
  for (const match of figureMatches) {
    const image = match[1];
    const content = match[2];
    if (!seenDescriptions.has(content)) {
      seenDescriptions.add(content);
      result.push({
        type: 'image-text',
        image,
        content,
      });
    }
  }

  // Lưu ý phụ phí
  const noteMatch = htmlString.match(/<h3><strong>Xin lưu ý:.*?(<ul>.*?<\/ul>)/s);
  if (noteMatch) {
    result.push({
      type: 'text',
      content: `Xin lưu ý: Sẽ áp dụng phụ phí nếu ngày tham gia của bạn trùng với ngày lễ, thanh toán tại chỗ (Vui lòng kiểm tra chi tiết gói để tham khảo).${noteMatch[1]}`,
    });
  }

  return result;
};

export default function TripDetailScreen() {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState({});
  const [currentTotalPrice, setCurrentTotalPrice] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const handleApplyVoucher = (voucher) => {
    setSelectedVoucher(voucher); 
  };

  const loadTourDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Gọi API để lấy dữ liệu tour
      const { tour, services = [], highlights = [], reviews = [] } = await fetchTourDetail(id);
      if (!tour || !tour._id) {
        throw new Error('Dữ liệu tour không hợp lệ.');
      }

      // Map services thành cấu trúc cho selector
      const availableServicePackages = services.map((svc) => ({
        id: svc._id,
        title: svc.title || svc.name,
        options: (svc.options || []).map((opt) => ({
          id: opt._id,
          name: opt.name,
          description: opt.description,
          price: opt.price_extra,
        })),
      }));

      // Map reviews về định dạng UI
      const mappedReviews = reviews.map((r) => {
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

      // Phân tích description
      const descriptionContent = parseDescription(tour.description || '');

      // Tạo productInfo cho ProductBasicInfo
      const productInfo = prepareProductInfo(tour, services, highlights, reviews);

      // Tạo productData
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
        descriptionContent,
        reviews: mappedReviews,
        tripNotes: tour.tripNotes || null,
        contactInformation: {
          supplier: tour.supplier_id || null,
        },
        services,
        highlights,
        productInfo,
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
        const option = pkg.options.find((opt) => opt.id === optId);
        if (option) {
          return sum + (option.price || 0);
        }
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
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <ProductImageCarousel
          images={productData.images}
          tourId={productData._id}
          onBackPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(tabs)/home')
          }
          onSharePress={() => Alert.alert('Chia sẻ', 'Tính năng đang phát triển')}
          onFavoritePress={() => {
            console.log('Đã nhấn nút yêu thích.');
          }}
        />

        <View style={styles.mainContentContainer}>
          <ProductBasicInfo
            productInfo={productData.productInfo}
            onSeeAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
            onSeeMoreHighlights={() => Alert.alert('Xem thêm điểm nổi bật')}
            onSeeOffers={() => Alert.alert('Xem ưu đãi')}
            onApplyVoucher={handleApplyVoucher} 
            selectedVoucher={selectedVoucher}
          />
          <View style={styles.separator} />

          <TripHighlightsSection
            title="Điểm nổi bật của chuyến đi"
            highlights={productData.highlights.map((highlight) => ({
              _id: highlight._id,
              image: highlight.image_url || 'https://via.placeholder.com/150',
              title: highlight.location_name || 'Điểm nổi bật',
              description: highlight.description || 'Mô tả điểm nổi bật của chuyến đi.',
            }))}
          />

          <View >
            <ProductOptionSelector
              servicePackages={productData.availableServicePackages}
              dateFilters={productData.availableDateFilters}
              initialTotalPrice={productData.price.current}
              onSelectionUpdate={(map, totalExtra) => {
                setCurrentSelectedPackages(map);
                setCurrentTotalPrice((productData?.price?.current || 0) + totalExtra);
              }}
            />
          </View>
          <CustomerReviewSection
            reviews={productData.reviews}
            averageRating={productData.rating.stars}
            totalReviewsCount={productData.rating.count}
            onViewAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
          />

          <DescriptionSection
            title="Thông tin chi tiết"
            descriptionData={productData.descriptionContent}
          />

          <NoteContactSection
            tripNotes={productData.tripNotes}
            contactInformation={productData.contactInformation}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <StickyBookingFooter
        selectedVoucher={selectedVoucher}
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