import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchTourDetail } from '../../../API/services/tourService';
import { useReviewContext } from '../../../store/ReviewContext';
import { COLORS } from '../../../constants/colors';
import CustomerReviewSection from './components/CustomerReviewSection';
import NoteContactSection from './components/NoteContactSection';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductOptionSelector from './components/ProductOptionSelector';
import StickyBookingFooter from './components/StickyBookingFooter';
import BookingModalContent from './components/Modal';

import TripHighlightsSection from './components/TripHighlightsSection';

// CÁC HÀM HELPER
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

const parseDescription = (htmlString) => {
  if (!htmlString) return [];

  const result = [];
  let idCounter = 0;
  const seenDescriptions = new Set();

  // Đoạn giới thiệu
  const introMatch = htmlString.match(/<p>(.*?)<\/p>/);
  if (introMatch) {
    result.push({ id: `desc-${idCounter++}`, type: 'text', content: introMatch[1].replace(/<[^>]*>?/gm, '') });
  }

  // Các đoạn hình ảnh và mô tả
  const figureMatches = htmlString.matchAll(/<figure class="image"><img[^>]+src="([^"]+)"[^>]*><\/figure><blockquote><p>(.*?)<\/p><\/blockquote>/g);
  for (const match of figureMatches) {
    const image = match[1];
    const content = match[2].replace(/<[^>]*>?/gm, '');
    if (!seenDescriptions.has(content)) {
      seenDescriptions.add(content);
      result.push({ id: `desc-${idCounter++}`, type: 'image-text', image, content });
    }
  }

  // Đoạn lưu ý
  const noteMatch = htmlString.match(/<h3><strong>Xin lưu ý:.*?(<ul>.*?<\/ul>)/s);
  if (noteMatch) {
    result.push({
      id: `desc-${idCounter++}`,
      type: 'text',
      content: `Xin lưu ý: Sẽ áp dụng phụ phí nếu ngày tham gia của bạn trùng với ngày lễ, thanh toán tại chỗ (Vui lòng kiểm tra chi tiết gói để tham khảo).${noteMatch[1]}`,
    });
  }

  // Nếu không có kết quả nào được phân tích, trả về một đoạn text mặc định
  if (result.length === 0) {
    result.push({ id: `desc-${idCounter++}`, type: 'text', content: htmlString.replace(/<[^>]*>?/gm, '') });
  }

  return result;
};

const formatPrice = (price, selectedVoucher) => {
  const value = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(value)) return 0;
  let finalPrice = value;
  if (selectedVoucher?.voucher_id?.discount) {
    const discount = selectedVoucher.voucher_id.discount;
    const minOrderValue = selectedVoucher.voucher_id.min_order_value || 0;
    if (value >= minOrderValue) {
      finalPrice = value - (value * discount) / 100;
    } else {
      Alert.alert('Thông báo', `Đơn hàng phải từ ${minOrderValue.toLocaleString('vi-VN')}đ để áp dụng voucher này.`);
    }
  }
  return Math.max(0, finalPrice);
};


export default function TripDetailScreen() {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams();
  const { setReviewData } = useReviewContext();
  const mappedReviewsRef = useRef([]);

  // STATE VÀ LOGIC
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState({});
  const [currentTotalPrice, setCurrentTotalPrice] = useState(0);

  const [bookingData, setBookingData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalExtraPrice, setTotalExtraPrice] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  const loadTourDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { tour, services = [], highlights = [], reviews = [] } = await fetchTourDetail(id);
      if (!tour || !tour._id) throw new Error('Dữ liệu tour không hợp lệ.');
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
      const mappedReviews = reviews.map((r) => {
        const hasValidName = (r.user?.first_name && r.user?.first_name.trim()) || (r.user?.last_name && r.user?.last_name.trim());
        return {
          _id: r._id,
          userName: hasValidName ? `${r.user?.first_name?.trim() || ''} ${r.user?.last_name?.trim() || ''}`.trim() : r.user_name || 'Khách ẩn danh',
          userAvatar: r.user?.avatarUrl || null,
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.created_at).toLocaleDateString('vi-VN'),
        };
      });
      mappedReviewsRef.current = mappedReviews;
      // Giờ đây descriptionContent sẽ có các phần tử với id duy nhất
      const descriptionContent = parseDescription(tour.description || '');
      const productInfo = prepareProductInfo(tour, services, highlights, reviews);
      const mappedProductData = {
        ...tour,
        images: (tour.image || []).map((uri, i) => ({ id: `img_${i}`, uri })),
        price: { current: tour.price ?? 0, original: tour.price ?? 0, currency: 'đ', unit: 'người' },
        rating: { stars: tour.rating ?? 0, count: mappedReviews.length },
        availableServicePackages,
        availableDateFilters: [],
        descriptionContent,
        reviews: mappedReviews,
        tripNotes: tour.tripNotes || null,
        contactInformation: { supplier: tour.supplier_id || null },
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
    const optionTotal = Object.values(currentSelectedPackages).reduce((sum, optId) => {
      for (const pkg of productData.availableServicePackages) {
        const option = pkg.options.find((opt) => opt.id === optId);
        if (option) return sum + (option.price || 0);
      }
      return sum;
    }, 0);


    const total_price = basePrice + optionTotal;

    // Mở modal thay vì chuyển trang
    setModalVisible(true);

  };

  // MÀN HÌNH LOADING VÀ LỖI
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

  // PHẦN HIỂN THỊ CHÍNH
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={[{ key: 'main-content' }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <View style={{ paddingTop: 16 }}>
            <ProductImageCarousel
              images={productData.images}
              tourId={productData._id}
              onBackPress={() =>
                router.canGoBack() ? router.back() : router.replace('/(tabs)/home')
              }
              onSharePress={() => Alert.alert('Chia sẻ', 'Tính năng đang phát triển')}
              onFavoritePress={() => console.log('Đã nhấn nút yêu thích.')}
            />
          </View>
        }

        renderItem={() => (
          <View style={styles.mainContentContainer}>
            <ProductBasicInfo
              productInfo={productData.productInfo}
              onSeeAllReviews={() => Alert.alert('Xem tất cả đánh giá')}
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

            <ProductOptionSelector
              servicePackages={productData.availableServicePackages}
              dateFilters={productData.availableDateFilters}
              initialTotalPrice={productData.price.current}
              onSelectionUpdate={(map, totalExtra) => {
                setCurrentSelectedPackages(map);
                recalculateTotalPrice(map, selectedVoucher);
              }}
            />

            <CustomerReviewSection
              reviews={productData.reviews}
              averageRating={productData.rating.stars}
              totalReviewsCount={productData.rating.count}
              onSeeAllReviews={() => {
                setReviewData({
                  reviews: mappedReviewsRef.current,
                  rating: productData.rating.stars,
                  count: mappedReviewsRef.current.length,
                });
                router.push('/(stack)/ShowReview');
              }}

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
        )}

        ListFooterComponent={<View style={{ height: 100 }} />}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      <StickyBookingFooter
        priceInfo={{
          ...productData.price,
          current: currentTotalPrice,
        }}
        eksoraPoints={28}
        tourName={productData.name}
        selectedVoucher={selectedVoucher}
        currentSelectedPackages={currentSelectedPackages}
        tourInfo={productData}
        onBookNow={onBookNow}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background || '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContentContainer: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    marginTop: -18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    paddingTop: 16,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 15,
  },
});