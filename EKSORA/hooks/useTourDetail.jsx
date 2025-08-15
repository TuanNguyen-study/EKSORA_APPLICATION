import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTourDetail } from '../API/services/tourService';
import { useReviewContext } from '../store/ReviewContext';
import { prepareProductInfo, parseDescription } from '../utils/tourDetailHelpers';
import { FavoriteContext } from '../store/FavoriteContext';

export const useTourDetail = (productId) => {
  const router = useRouter();
  const { setReviewData } = useReviewContext();
  const mappedReviewsRef = useRef([]);

  // SỬ DỤNG CONTEXT VÀ THÊM CÁC STATE MỚI
  const { likedTours, addFavorite, removeFavorite } = useContext(FavoriteContext);

  // State gốc của bạn 
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState({});
  const [bookingDetails, setBookingDetails] = useState(null);
  const [pricePerPerson, setPricePerPerson] = useState(0);

  // State mới để quản lý đăng nhập và hành động
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // BƯỚC 3: TẠO RA GIÁ TRỊ isFavorited VÀ KIỂM TRA ĐĂNG NHẬP
  // Trạng thái yêu thích được suy ra trực tiếp từ context
  const isFavorited = likedTours.includes(productId);

  // useEffect để kiểm tra trạng thái đăng nhập khi hook được tải
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []); // Chạy 1 lần duy nhất

  // Các hàm gốc 
  const recalculatePricePerPerson = useCallback(() => {
    if (!productData) return;

    const basePrice = productData.price.current || 0;
    const optionTotal = Object.values(currentSelectedPackages).reduce((sum, optId) => {
      for (const pkg of productData.availableServicePackages) {
        const option = pkg.options.find((opt) => opt.id === optId);
        if (option) return sum + (option.price || 0);
      }
      return sum;
    }, 0);

    const finalPricePerPerson = basePrice + optionTotal;
    setPricePerPerson(finalPricePerPerson);
  }, [productData, currentSelectedPackages]);
  // LẤY THÔNG TIN CỦA TOUR
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
          title: opt.title,
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
          images: r.images || [],
          date: new Date(r.created_at).toLocaleDateString('vi-VN'),
        };
      });
      mappedReviewsRef.current = mappedReviews;

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
      setPricePerPerson(mappedProductData.price.current);

    } catch (e) {
      console.error('Lỗi khi lấy chi tiết tour:', e);
      setError(e.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      loadTourDetails(productId);
    }
  }, [productId, loadTourDetails]);

  useEffect(() => {
    recalculatePricePerPerson();
  }, [recalculatePricePerPerson]);

  const onRefresh = useCallback(() => {
    if (productId) {
      setRefreshing(true);
      loadTourDetails(productId);
    }
  }, [productId, loadTourDetails]);

  const handleSelectionUpdate = (packagesMap) => {
    setCurrentSelectedPackages(packagesMap);
  };

  const onSeeAllReviews = () => {
    if (!productData) return;
    setReviewData({
      reviews: mappedReviewsRef.current,
      rating: productData.rating.stars,
      count: mappedReviewsRef.current.length,
    });
    router.push('/(stack)/ShowReview');
  };

  // BƯỚC 4: CẬP NHẬT HÀM onBookNow VÀ THÊM HÀM onFavoritePress
  // Cập nhật hàm onBookNow để kiểm tra đăng nhập
  const onBookNow = useCallback(() => {
    // Thêm bước kiểm tra đăng nhập
    if (!isLoggedIn) {
      setLoginModalVisible(true);
      return; // Dừng hàm nếu chưa đăng nhập
    }


    if (!productData) return;

    const selectedOptionsDetails = Object.entries(currentSelectedPackages).map(([packageId, optionId]) => {
      const pkg = productData.availableServicePackages.find((p) => p.id === packageId);
      const option = pkg?.options.find((opt) => opt.id === optionId);
      return {
        packageId, optionId,
        title: pkg?.title || 'Dịch vụ không xác định',
        optionName: option?.name || 'Tùy chọn không xác định',
        optionPrice: option?.price || 0,
        optionDescription: option?.description || '',
      };
    });

    const bookingPayload = {
      tour_id: productData._id,
      tour_title: productData.name,
      total_price: pricePerPerson,
      selectedOptions: currentSelectedPackages,
      selectedOptionsDetails,
      image: productData.images[0]?.uri || '',
    };

    setBookingDetails(bookingPayload);
  }, [isLoggedIn, productData, currentSelectedPackages, pricePerPerson]); // Thêm isLoggedIn vào dependencies

  // Thêm hàm onFavoritePress hoàn toàn mới
  const onFavoritePress = useCallback(async () => {
    if (!isLoggedIn) {
      setLoginModalVisible(true);
      return;
    }
    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
    } catch (error) {
      console.error('Hành động yêu thích thất bại:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  }, [isLoggedIn, isFavorited, productId, addFavorite, removeFavorite, isFavoriteLoading]);

  const clearBookingDetails = () => {
    setBookingDetails(null);
  };

  // BƯỚC 5: CẬP NHẬT OBJECT TRẢ VỀ
  return {
    // Các giá trị gốc
    productData,
    loading,
    error,
    refreshing,
    currentTotalPrice: pricePerPerson,
    currentSelectedPackages,
    bookingDetails,
    loadTourDetails,
    onRefresh,
    handleSelectionUpdate,
    onSeeAllReviews,
    onBookNow, // <-- Hàm này đã có kiểm tra đăng nhập
    clearBookingDetails,

    // Các giá trị mới được thêm vào
    isFavorited,
    isFavoriteLoading,
    isLoginModalVisible,
    setLoginModalVisible,
    onFavoritePress, // <-- Hàm mới cho nút yêu thích
  };
};