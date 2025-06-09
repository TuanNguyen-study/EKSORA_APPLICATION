import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text, 
  StyleSheet,
  ScrollView,
  ActivityIndicator, 
  Alert,
  Platform,
  RefreshControl,
  Share, 
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons'; 
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductOptionSelector from './components/ProductOptionSelector';
import ServiceDescriptionSection from './components/ServiceDescriptionSection.'
import CustomerReviewSection from './components/CustomerReviewSection';
import PolicyInfoSection from './components/PolicyInfoSection';
import StickyBookingFooter from './components/StickyBookingFooter';


// --- DỮ LIỆU GIẢ  ---
const MOCK_PRODUCT_DATA = {
  id: '123',
  name: 'Combo Du Lịch Biển Đảo Sang Chảnh - Khám Phá Vịnh Kỳ Diệu 5 Ngày 4 Đêm',
  partnerAwards: {
    image: { uri: 'https://via.placeholder.com/80x100/FFD700/000000?Text=Awards' },
    line1: 'PARTNER AWARDS',
    year: '2024',
    line2: 'Best of Vietnam',
  },
  departurePoint: 'Đà Nẵng',
  bookingCount: '9.1K+',
  tags: [
    { label: 'Tiếng Anh/Tiếng Việt' },
    { label: 'Tour ghép' },
    { label: 'Tùy chọn đón tại khách sạn', isSpecial: false },
  ],
  summaryHighlight: {
    items: [
      'Thăm quan những di tích ngoạn mục của cố đô xưa nhà Đinh Lê',
      'Trải nghiệm ẩm thực địa phương độc đáo',
    ],
    logo: { uri: 'https://via.placeholder.com/60x60/0087CA/FFFFFF?Text=E' },
    logoText: 'EKSORA'
  },
  offers: [
    { label: 'Giảm 5%', icon: 'pricetag-outline', bgColor: '#FFE0B2', textColor: '#E65100' },
    { label: 'Sale Giảm 25%', icon: 'flash-outline', bgColor: '#C8E6C9', textColor: '#1B5E20' },
  ],
  supplier: {
    logoUrl: 'https://via.placeholder.com/100x30.png?text=EKSORA+Travel',
    name: 'EKSORA Travel',
    tag: 'Đối tác Kim Cương',
  },
  images: [
    { id: 'img1', uri: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=1740&auto=format&fit=crop' },
    { id: 'img2', uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop' },
    { id: 'img3', uri: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
    { id: 'img4', uri: 'https://picsum.photos/seed/service_img1/800/480' },
    { id: 'img5', uri: 'https://picsum.photos/seed/service_img1/800/480' },
  ],
  rating: {
    stars: 4.8,
    count: 769,
    detailsText: "769 Đánh giá",
  },
  price: {
    original: 12800000,
    current: 9990000,
    discountPercentage: Math.round(((12800000 - 9990000) / 12800000) * 100),
    currency: 'đ',
    unit: 'người',
  },
  availableServicePackages: [
    { id: 'pkg_adult_main', name: 'Người lớn', availabilityInfo: 'Đặt từ 11/5', currentPrice: 750000, originalPrice: 800000, currency: 'đ' },
    { id: 'pkg_child_main', name: 'Trẻ em (Cao 90cm-120cm)', availabilityInfo: 'Đặt từ 11/5', currentPrice: 70000, originalPrice: 100000, currency: 'đ' },
    { id: 'pkg_senior_main', name: 'Người cao tuổi (Trên 60t)', availabilityInfo: 'Đặt từ 12/5', currentPrice: 600000, originalPrice: 650000, currency: 'đ' }
  ],
  availableDateFilters: [
    { id: 'tomorrow', label: 'Ngày mai', isDefault: true },
    { id: 'date_11_5', label: '11/5' },
    { id: 'date_12_5', label: '12/5' },
    { id: 'all_dates', label: 'Tất cả ngày', icon: 'calendar-outline' },
  ],
  descriptionContent: [
    { type: 'text', content: "Du hành về quá khứ và khám phá thủ đô cổ đại của các triều đại Đinh và Lê, nổi tiếng với những tàn tích lạ thường đã sống sót qua một thiên niên kỷ. Phong cảnh xung quanh cực kỳ ngoạn mục, vì vậy hãy đảm bảo bạn có sẵn chiếc máy ảnh trong tay để chụp lại những cảnh đẹp tuyệt vời bên trong Hoa Lư. Hướng dẫn viên địa phương nhiệt tình sẽ giới thiệu cho bạn một số món ăn đậm chất nhất Ninh Bình vào bữa trưa, trước khi bắt đầu chuyến đi đò thư giãn trên sông Ngô Đồng và tận mắt ngắm mình Tam Cốc hùng vĩ nổi bật giữa vùng. Những ngọn núi đá vôi cao nguyên chọc thẳng trời xanh, những cánh đồng lúa tươi xanh và bạn sẽ biết được tại sao Hoa Lư còn được gọi là “Vịnh Hạ Long trên đất liền”. Hướng dẫn viên sẽ lo liệu hết tất cả việc trung chuyển và di chuyển trong tour, vì vậy bạn chỉ cần ngồi thư giãn và tận hưởng một ngày nghỉ ngơi thư giãn khi khám phá vẻ đẹp tự nhiên ngoạn mục của Việt Nam nhé." },
    { type: 'image', uri: 'https://picsum.photos/seed/service_img1/800/480', caption: "Take a trip to the ancient capital of the Dinh and Le dynasties when you visit the provincial city of Hoa Lu" },
    { type: 'text', content: "Khám phá thêm về các di tích lịch sử và kiến trúc độc đáo tại đây. Mỗi góc nhìn đều mang một câu chuyện riêng, chờ bạn khám phá và cảm nhận." },
    { type: 'image', uri: 'https://picsum.photos/seed/service_img2/800/480', caption: "Another beautiful scenery from the trip." }
  ],
  reviews: [
    { id: 'r1', userAvatar: 'https://i.pravatar.cc/80?u=vo_huynh_tuan_anh', userName: 'Võ Huỳnh Tuấn Anh', rating: 5, comment: 'Mỗi chuyến đi là một hành trình mới, không chỉ để khám phá vùng đất xa lạ, mà còn để hiểu thêm về chính bản thân mình. Và nơi này đã mang lại vô vàn cảm xúc tích cực, dịch vụ tuyệt vời và cảnh quan hùng vĩ. Sẽ giới thiệu cho bạn bè!', date: '09/05/2024', images: [] },
    { id: 'r2', userAvatar: 'https://i.pravatar.cc/80?u=nguyen_van_b', userName: 'Nguyễn Văn B', rating: 4, comment: 'Khách sạn tốt, view đẹp. Nhân viên thân thiện. Đồ ăn sáng cần đa dạng hơn một chút.', date: '05/05/2024', images: [] },
    { id: 'r3', userAvatar: 'https://i.pravatar.cc/80?u=tran_thi_c', userName: 'Trần Thị C', rating: 5, comment: 'Chuyến đi tuyệt vời! Highly recommend cho các cặp đôi muốn có không gian riêng tư và lãng mạn.', date: '01/05/2024', images: [] },
  ],
  highlights: [
    { id: 'h1', image: { uri: 'https://picsum.photos/seed/hl1/400/240' }, title: 'Biệt thự biển sang trọng', description: 'Nghỉ dưỡng tại biệt thự riêng tư với hồ bơi và tầm nhìn hướng biển tuyệt đẹp.' },
    { id: 'h2', image: { uri: 'https://picsum.photos/seed/hl2/400/240' }, title: 'Ẩm thực đỉnh cao', description: 'Thưởng thức các món ăn tinh tế được chế biến bởi đầu bếp hàng đầu tại nhà hàng Michelin.' },
    { id: 'h3', image: { uri: 'https://picsum.photos/seed/hl3/400/240' }, title: 'Du thuyền ngắm hoàng hôn', description: 'Trải nghiệm lãng mạn trên du thuyền riêng, ngắm nhìn hoàng hôn buông xuống trên vịnh.' },
  ],
  tripNotes: {
    title: "Những điều cần lưu ý",
    items: [
      "#Group size information:",
      "• Standard bus: a maximum of 30-32 pax",
      "• Limousine Bus: a maximum of 17-22 pax",
      "• DCar: a maximum of 9 - 11 pax",
      "#General Notes:",
      "- Please bring your personal identification for check-in.",
      "- Itinerary might be subject to change due to weather or traffic conditions."
    ]
  },
  contactInformation: {
    title: "Liên hệ với chúng tôi",
    description: "Bạn thắc mắc về dịch vụ này? Chat với ESORA!",
    buttonText: "Chat với chúng tôi"
  }
};
// --- KẾT THÚC DỮ LIỆU GIẢ ---

export default function TripDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id || MOCK_PRODUCT_DATA.id;

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState({});
  const [currentTotalPrice, setCurrentTotalPrice] = useState(0);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentSelectedPackages({});
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      if (productId === MOCK_PRODUCT_DATA.id) {
        setProductData(MOCK_PRODUCT_DATA);
        setCurrentTotalPrice(MOCK_PRODUCT_DATA.price.current);
      } else {
        throw new Error('Không tìm thấy thông tin chi tiết sản phẩm.');
      }
    } catch (e) {
      setError(e.message);
      console.error("Error fetching product details:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleShare = async () => {
    if (!productData) return;
    try {
      await Share.share({
        message: `Trải nghiệm ${productData.name} cùng EKSORA! Chi tiết: yourapp://trip-detail/${productData.id}`,
        url: `yourapp://trip-detail/${productData.id}`
      });
    } catch (e) {
      Alert.alert("Lỗi chia sẻ", e.message);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(prev => !prev);
    Alert.alert(isFavorite ? "Đã bỏ khỏi Yêu thích" : "Đã thêm vào Yêu thích");
  };

  const handleAudioGuide = () => Alert.alert("Audio Guide", "Chức năng đang phát triển.");
  const handleCart = () => Alert.alert("Giỏ hàng", "Chức năng đang phát triển.");
  const handleImagePress = (imageId) => Alert.alert("Xem ảnh", `Xem chi tiết ảnh ${imageId}`);

  const handlePackageSelectionUpdate = (selectedPackagesMap, totalPrice) => {
    setCurrentSelectedPackages(selectedPackagesMap);
    setCurrentTotalPrice(totalPrice);
  };

  const handleDateFilterChange = (filterId) => {
    console.log('TripDetailScreen: Bộ lọc ngày đã đổi:', filterId);
  };

  const handleViewAllReviews = () => {
    Alert.alert("Action", "Điều hướng đến trang tất cả đánh giá");
  };

  const handleChatWithUs = () => {
    Alert.alert("Action", "Mở màn hình Chat với EKSORA");
  };

  if (loading && !productData && !refreshing) {
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
        <TouchableOpacity onPress={fetchProductDetails} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!productData) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Không có dữ liệu' }} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Không có dữ liệu để hiển thị.</Text>
      </View>
    );
  }

  const footerPriceInfo = {
    ...(productData.price || { currency: 'đ', unit: 'người', current: 0, original: 0, discountPercentage: 0 }), // Đảm bảo price không bao giờ null
    current: currentTotalPrice > 0 ? currentTotalPrice : (productData.price?.current || 0),
    unit: Object.keys(currentSelectedPackages).length > 0 ? (Object.keys(currentSelectedPackages).length > 1 ? 'các gói' : 'gói') : (productData.price?.unit || 'người'),
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />
        }
      >
        <ProductImageCarousel
          images={productData.images}
          isFavorite={isFavorite}
          onBackPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}
          onSharePress={handleShare}
          onFavoritePress={handleFavorite}
          onAudioGuidePress={handleAudioGuide}
          onCartPress={handleCart}
          onImagePress={handleImagePress}
        />

        <View style={styles.mainContentContainer}>
          <ProductBasicInfo
            productInfo={productData}
            onSeeAllReviews={handleViewAllReviews}
            onSeeMoreHighlights={() => Alert.alert("Action", "Xem thêm điểm nổi bật")}
            onSeeOffers={() => Alert.alert("Action", "Xem tất cả ưu đãi")}
          />

          <View style={styles.separator} />

          <ProductOptionSelector
            servicePackages={productData.availableServicePackages}
            dateFilters={productData.availableDateFilters}
            initialTotalPrice={productData.price.current}
            onSelectionUpdate={handlePackageSelectionUpdate}
            onDateFilterChange={handleDateFilterChange}
          />


          <CustomerReviewSection
            reviews={productData.reviews}
            averageRating={productData.rating.stars}
            totalReviewsCount={productData.rating.count}
            onViewAllReviews={handleViewAllReviews}
          />

          <ServiceDescriptionSection
            title="Về dịch vụ này"
            descriptionContent={productData.descriptionContent}
          />

          {/* <View style={styles.separator} /> */}

          {/* <TripHighlightsSection
            title="Điểm nổi bật của chuyến đi"
            highlights={productData.highlights}
          /> */}

          {/* <View style={styles.separator} /> */}

          <PolicyInfoSection
            noteTitle={productData.tripNotes?.title}
            notes={productData.tripNotes?.items}
            contactInfo={productData.contactInformation}
            onChatPress={handleChatWithUs}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {productData && productData.price && (
        <StickyBookingFooter
          priceInfo={footerPriceInfo}
          eksoraPoints={productData.eksoraPointsEarned} 
          onAddToCart={() => Alert.alert("Chức năng", "Thêm vào giỏ hàng với tổng giá: " + footerPriceInfo.current.toLocaleString('vi-VN') + " " + (footerPriceInfo.currency || 'đ'))}
          onBookNow={() => Alert.alert("Chức năng", "Đặt ngay với tổng giá: " + footerPriceInfo.current.toLocaleString('vi-VN') + " " + (footerPriceInfo.currency || 'đ'))}
          onEksoraPointsPress={() => Alert.alert("Action", "Xem chi tiết EKSORA Xu")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 16,
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
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 15,
    marginHorizontal: -16,
  },
});