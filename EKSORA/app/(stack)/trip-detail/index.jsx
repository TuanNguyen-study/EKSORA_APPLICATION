// app/(stack)/trip-detail/index.jsx
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
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
// Giả sử bạn có service để fetch dữ liệu
// import { getProductDetailsById } from '@/API/services/productService'; // Đường dẫn ví dụ
import { COLORS } from '@/constants/colors';

// Import các components con (sẽ tạo trong thư mục ./components/)
import ProductImageCarousel from './conponents/ProductImageCarousel';
import ProductBasicInfo from './conponents/ProductBasicInfo';
import ProductOptionSelector from './conponents/ProductOptionSelector';
import ExpandableDescription from './conponents/ExpandableDescription';
import CustomerReviewSection from './conponents/CustomerReviewSection';
import TripHighlightsSection from './conponents/TripHighlightsSection';
import PolicyInfoSection from './conponents/PolicyInfoSection';
import StickyBookingFooter from './conponents/StickyBookingFooter';

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
// Thay thế bằng API call thực tế
const MOCK_PRODUCT_DATA = {
  id: '123',
  name: 'Combo Khách Sạn 4 Sao + Vé Máy Bay Đà Nẵng Hội An - 4 Ngày 3 Đêm',
  supplier: {
    logoUrl: 'https://via.placeholder.com/60x25.png?text=VNTRAVEL',
    name: 'VNTRAVEL',
    tag: 'Đối tác Vàng',
  },
  images: [
    { id: 'img1', uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'img2', uri: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'img3', uri: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ],
  rating: {
    stars: 4.8,
    count: 1672,
    detailsText: "1,6k đánh giá",
  },
  price: {
    original: 3250000,
    current: 2750000,
    discountPercentage: Math.round(((3250000 - 2750000) / 3250000) * 100),
    currency: 'đ',
    unit: 'khách',
  },
  options: { // Dữ liệu cho ProductOptionSelector
    departureDates: [{label: '15/08/2024', value: '2024-08-15'}, {label: '20/08/2024', value: '2024-08-20'}],
    passengerTypes: [
      { id: 'adult', label: 'Người lớn', count: 1, pricePerUnit: 2750000 },
      { id: 'child', label: 'Trẻ em (2-11t)', count: 0, pricePerUnit: 1800000 },
      { id: 'infant', label: 'Em bé (<2t)', count: 0, pricePerUnit: 500000 },
    ],
    quickFilters: ['Ngày tốt', 'Giá tốt', 'Gần tôi', 'Top bán chạy'],
  },
  description: "Trải nghiệm kỳ nghỉ tuyệt vời tại Đà Nẵng và Hội An với combo khách sạn 4 sao sang trọng và vé máy bay khứ hồi. Gói dịch vụ bao gồm 4 ngày 3 đêm nghỉ dưỡng, đưa đón sân bay và nhiều ưu đãi hấp dẫn khác. Khám phá vẻ đẹp của Cầu Vàng, Phố cổ Hội An và thưởng thức ẩm thực địa phương đặc sắc. Phù hợp cho các cặp đôi, gia đình và nhóm bạn muốn có một chuyến đi đáng nhớ. Dịch vụ chất lượng cao, đội ngũ hỗ trợ nhiệt tình 24/7.",
  reviews: [
    { id: 'r1', userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg', userName: 'Nguyễn An Nhiên', rating: 5, comment: 'Chuyến đi rất tuyệt vời, dịch vụ tốt, khách sạn đẹp. Hướng dẫn viên nhiệt tình, đồ ăn ngon. Sẽ giới thiệu cho bạn bè và quay lại vào dịp tới!', date: '20/07/2024', images: [{id:'rev_img1', uri: 'https://images.unsplash.com/photo-1568402407999-a26ac911f23d?q=80&w=300&auto=format&fit=crop' }] },
    { id: 'r2', userAvatar: 'https://randomuser.me/api/portraits/men/75.jpg', userName: 'Trần Minh Long', rating: 4, comment: 'Khách sạn ổn, vị trí thuận tiện. Có một vài điểm nhỏ cần cải thiện nhưng nhìn chung là hài lòng.', date: '15/07/2024', images: [] },
  ],
  highlights: [
    { id: 'h1', image: { uri: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800&auto=format&fit=crop' }, title: 'Tham quan Cầu Vàng - Bà Nà Hills', description: 'Chiêm ngưỡng kiến trúc độc đáo và cảnh quan tuyệt đẹp từ Cầu Vàng nổi tiếng thế giới.' },
    { id: 'h2', image: { uri: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=800&auto=format&fit=crop' }, title: 'Dạo bước Phố cổ Hội An lung linh', description: 'Khám phá vẻ đẹp cổ kính, lãng mạn của Hội An với những chiếc đèn lồng và kiến trúc độc đáo.' },
    { id: 'h3', image: { uri: 'https://images.unsplash.com/photo-1504622587143-32811c6f3969?q=80&w=800&auto=format&fit=crop' }, title: 'Thưởng thức ẩm thực địa phương', description: 'Nếm thử các món ăn đặc sản nổi tiếng của Đà Nẵng và Hội An.' },
  ],
  policies: [
    { id: 'p1', title: 'Giá vé & Phụ thu', content: 'Giá vé đã bao gồm thuế VAT và phí dịch vụ. Phụ thu có thể áp dụng cho các ngày lễ, Tết hoặc yêu cầu đặc biệt. Trẻ em dưới 2 tuổi miễn phí nếu không chiếm chỗ riêng.' },
    { id: 'p2', title: 'Chính sách hoàn hủy', content: 'Hoàn hủy miễn phí trước 15 ngày khởi hành. Hoàn hủy trong vòng 7-14 ngày, phí 50%. Hoàn hủy dưới 7 ngày hoặc không thông báo, không hoàn tiền. Chính sách có thể thay đổi tùy theo nhà cung cấp dịch vụ.' },
    { id: 'p3', title: 'Lưu ý quan trọng', content: 'Vui lòng mang theo giấy tờ tùy thân hợp lệ. Kiểm tra kỹ thông tin chuyến bay và khách sạn trước ngày đi. Liên hệ hotline để được hỗ trợ nếu có bất kỳ thay đổi nào.' },
  ],
};
// --- KẾT THÚC DỮ LIỆU GIẢ ---

export default function TripDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id || MOCK_PRODUCT_DATA.id; // Lấy id từ params, fallback về mock

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // State ví dụ cho nút yêu thích
  const [refreshing, setRefreshing] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    console.log(`Fetching details for product ID: ${productId}`);
    setLoading(true);
    setError(null);
    try {
      // TODO: Thay thế bằng API call thực tế
      // const data = await getProductDetailsById(productId);
      await new Promise(resolve => setTimeout(resolve, 700)); // Giả lập delay
      if (productId === MOCK_PRODUCT_DATA.id) { // Giả lập thành công
        setProductData(MOCK_PRODUCT_DATA);
      } else { // Giả lập lỗi không tìm thấy
        throw new Error('Không tìm thấy thông tin chi tiết sản phẩm.');
      }
    } catch (e) {
      setError(e.message);
      // Alert.alert("Lỗi tải dữ liệu", e.message);
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
    try {
      const result = await Share.share({
        message: `Xem thử combo tuyệt vời này: ${productData?.name} tại EKSORA!`,
        url: `yourapp://trip-detail/${productData?.id}` // Link đến app của bạn (cần cấu hình deep linking)
      });
      // ... xử lý kết quả share
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(prev => !prev);
    // TODO: Gọi API để lưu trạng thái yêu thích
    Alert.alert(isFavorite ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích");
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết chuyến đi...</Text>
      </View>
    );
  }

  if (error && !productData) { // Chỉ hiển thị lỗi toàn màn hình nếu không có dữ liệu nào cả
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
  
  if (!productData) { // Trường hợp không loading, không error nhưng cũng không có data
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Không có dữ liệu' }} />
        <Text>Không có dữ liệu để hiển thị.</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: productData?.name?.substring(0, 25) + '...' || 'Chi tiết' }} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary}/>
        }
      >
        <ProductImageCarousel
          images={productData.images}
          isFavorite={isFavorite}
          onBackPress={() => router.canGoBack() ? router.back() : null}
          onSharePress={handleShare}
          onFavoritePress={handleFavorite}
        />

        <View style={styles.mainContentContainer}>
          <ProductBasicInfo
            name={productData.name}
            supplier={productData.supplier}
            rating={productData.rating}
            price={productData.price}
          />

          <View style={styles.separator} />

          <ProductOptionSelector
            options={productData.options}
            currentPrice={productData.price.current} // Để tính toán giá mới
            onSelectionChange={(newSelection, newTotalPrice) => {
              console.log('Lựa chọn mới:', newSelection);
              console.log('Tổng giá mới:', newTotalPrice);
              // Cập nhật state giá ở đây nếu cần
            }}
          />

          <View style={styles.separator} />

          <ExpandableDescription
            title="Mô tả chi tiết"
            description={productData.description}
          />

          <View style={styles.separator} />

          <CustomerReviewSection
            reviews={productData.reviews}
            averageRating={productData.rating.stars}
            totalReviewsCount={productData.rating.count}
          />

          <View style={styles.separator} />
          
          <TripHighlightsSection
            title="Điểm nổi bật của chuyến đi"
            highlights={productData.highlights}
          />

          <View style={styles.separator} />

          <PolicyInfoSection
            title="Thông tin cần biết"
            policies={productData.policies}
          />
        </View>
        {/* Khoảng trống để footer không che mất nội dung cuối */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {productData && (
        <StickyBookingFooter
          priceInfo={productData.price} // Hoặc giá đã được cập nhật từ ProductOptionSelector
          onAddToCart={() => Alert.alert("Chức năng","Thêm vào giỏ hàng")}
          onBookNow={() => Alert.alert("Chức năng", "Đặt ngay")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Hoặc COLORS.background nếu muốn màu nền khác
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
    marginTop:10,
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
  },
  separator: {
    height: 10, // Hoặc 1
    backgroundColor: COLORS.background, // Hoặc COLORS.border
    marginVertical: 15, // Tạo khoảng cách giữa các section
    marginHorizontal: -16, // Để separator full width nếu mainContentContainer có padding
  },
});