// file: screens/TripDetail/TripDetailScreen.js (ĐÃ ĐƯỢC CẬP NHẬT)

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// THAY ĐỔI: Import thêm useState để quản lý modal chia sẻ
import { useState } from 'react'; 
import { COLORS } from '../../../constants/colors';

// Import các component con
import CustomerReviewSection from './components/CustomerReviewSection';
import NoteContactSection from './components/NoteContactSection';
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductOptionSelector from './components/ProductOptionSelector';
import StickyBookingFooter from './components/StickyBookingFooter';
import DescriptionSection from './components/DescriptionSection';
import TripHighlightsSection from './components/TripHighlightsSection';
import BookingModalWrapper from '../bookingModal/components/BookingModalWrapper';

// Import hook và modal
import { useTourDetail } from '../../../hooks/useTourDetail';
import LoginRequestModal from '../../../components/LoginRequestModal';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams();

  // Lấy các giá trị từ hook - phần này đã rất tốt!
  const {
    productData,
    loading,
    error,
    refreshing,
    currentTotalPrice,
    bookingDetails,
    isFavorited,
    isLoginModalVisible,
    setLoginModalVisible,
    loadTourDetails,
    onRefresh,
    handleSelectionUpdate,
    onSeeAllReviews,
    onBookNow,
    onFavoritePress,
    clearBookingDetails,
  } = useTourDetail(productId);

  // --- THAY ĐỔI: QUẢN LÝ TRẠNG THÁI CHO MODAL CHIA SẺ ---
  // Chúng ta sẽ không dùng Share API gốc nữa, mà dùng ShareModal tùy chỉnh
  // được điều khiển bởi ProductImageCarousel
  const [isShareModalVisible, setShareModalVisible] = useState(false);

  // Xóa hàm handleShareTour cũ, thay bằng các hàm điều khiển modal
  // const handleShareTour = async () => { ... }; // <- Xóa hàm này đi

  const openShareModal = () => setShareModalVisible(true);
  const closeShareModal = () => setShareModalVisible(false);

  // --- GIAO DIỆN LOADING, LỖI (Giữ nguyên, đã làm tốt) ---
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

  if (!productData) {
    return null;
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={[{ key: 'main-content' }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          // THAY ĐỔI: Truyền đầy đủ các props mới vào ProductImageCarousel
          <ProductImageCarousel
            images={productData.images}
            tourData={productData} // Cần thiết cho ShareModal
            onBackPress={() =>
              router.canGoBack() ? router.back() : router.replace('/(tabs)/home')
            }
            
            // Props cho tính năng Yêu thích (đã đúng)
            isFavorited={isFavorited}
            onFavoritePress={onFavoritePress}
            
            // Props cho tính năng Chia sẻ (cập nhật)
            isShareModalVisible={isShareModalVisible}
            onSharePress={openShareModal} // Mở modal khi nhấn nút
            onCloseShareModal={closeShareModal} // Đóng modal
          />
        }
        renderItem={() => (
          <View style={styles.mainContentContainer}>
            {/* Các component con khác không thay đổi */}
            <ProductBasicInfo
              productInfo={productData.productInfo}
              onSeeAllReviews={onSeeAllReviews}
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
        }}
        eksoraPoints={28}
        onBookNow={onBookNow} 
      />

      <BookingModalWrapper
        visible={!!bookingDetails}
        onClose={clearBookingDetails}
        bookingDetails={bookingDetails}
      />
      
      {/* Modal yêu cầu đăng nhập (đã đúng) */}
      <LoginRequestModal 
        isVisible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
}

// --- STYLES (Giữ nguyên) ---
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
      height: 8,
      backgroundColor: '#F3F4F6',
      marginVertical: 15,
    },
  });