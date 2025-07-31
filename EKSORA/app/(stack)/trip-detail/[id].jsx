import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import { COLORS } from '../../../constants/colors';
import CustomerReviewSection from './components/CustomerReviewSection';
import NoteContactSection from './components/NoteContactSection';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductOptionSelector from './components/ProductOptionSelector';
import StickyBookingFooter from './components/StickyBookingFooter';
import DescriptionSection from './components/DescriptionSection';
import TripHighlightsSection from './components/TripHighlightsSection';
import BookingModalWrapper from '../bookingModal/components/BookingModalWrapper';
import { useTourDetail } from '../../../hooks/useTourDetail';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams();
  const {
    productData,
    loading,
    error,
    refreshing,
    currentTotalPrice,
    currentSelectedPackages,
    selectedVoucher,
    loadTourDetails,
    onRefresh,
    handleApplyVoucher,
    handleSelectionUpdate,
    onSeeAllReviews,
    onBookNow, // Lấy hàm chuẩn bị data
    bookingDetails, // Lấy state chứa data
    clearBookingDetails,
    priceBeforeDiscount, // Lấy hàm để đóng modal và xóa data
  } = useTourDetail(productId);

  const handleShareTour = async () => {
    const shareUrl = `https://eksora.com/tour/${productData._id}`;
    const shareTitle = `${productData.name} - Chỉ từ ${productData.price?.current?.toLocaleString('vi-VN') || '0'}đ`;
    const shareText = `Khám phá ${productData.name} tại ${productData.province}. Đặt tour ngay tại EKSORA!`;

    try {
      const result = await Share.share({
        message: `${shareTitle}\n\n${shareText}\n\n${shareUrl}`,
        title: shareTitle,
        url: shareUrl,
      });

      if (result.action === Share.sharedAction) {
        console.log('Tour shared successfully');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chia sẻ tour này');
    }
  };

  if (loading && !productData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết địa điểm...</Text>
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

  // Nếu vì lý do nào đó productData chưa có thì không render gì cả
  if (!productData) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={[{ key: 'main-content' }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ProductImageCarousel
            images={productData.images}
            tourId={productData._id}
            tourData={productData}
            onBackPress={() =>
              router.canGoBack() ? router.back() : router.replace('/(tabs)/home')
            }
            onSharePress={handleShareTour}
            onFavoritePress={() => console.log('Đã nhấn nút yêu thích.')}
          />
        }
        renderItem={() => (
          <View style={styles.mainContentContainer}>
            <ProductBasicInfo
              productInfo={productData.productInfo}
              onSeeAllReviews={onSeeAllReviews}
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
              onSelectionUpdate={handleSelectionUpdate}
            />
            <CustomerReviewSection
              reviews={productData.reviews}
              averageRating={productData.rating.stars}
              totalReviewsCount={productData.rating.count}
              onSeeAllReviews={onSeeAllReviews}
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
          original: priceBeforeDiscount,
        }}
        eksoraPoints={28}
        tourName={productData.name}
        selectedVoucher={selectedVoucher}
        currentSelectedPackages={currentSelectedPackages}
        tourInfo={productData}
        onBookNow={onBookNow}
      />

      <BookingModalWrapper
        visible={!!bookingDetails}
        onClose={clearBookingDetails}
        bookingDetails={bookingDetails}
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
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 15,
  },
});