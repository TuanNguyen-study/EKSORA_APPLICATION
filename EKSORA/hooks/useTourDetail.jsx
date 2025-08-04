import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { fetchTourDetail } from '../API/services/tourService';
import { useReviewContext } from '../store/ReviewContext';
import { prepareProductInfo, parseDescription } from '../utils/tourDetailHelpers';

export const useTourDetail = (productId) => {
  const router = useRouter();
  const { setReviewData } = useReviewContext();
  const mappedReviewsRef = useRef([]);

  // State
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState({});
  const [bookingDetails, setBookingDetails] = useState(null);

  // Chỉ còn một state duy nhất cho giá, đại diện cho giá gốc + options
  const [pricePerPerson, setPricePerPerson] = useState(0);

  // Hàm tính giá được đơn giản hóa, không còn tham số voucher
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

    // Cập nhật giá cho một người (đã bao gồm options)
    const finalPricePerPerson = basePrice + optionTotal;
    setPricePerPerson(finalPricePerPerson);
  }, [productData, currentSelectedPackages]);


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
  
  // Gọi lại hàm tính giá mỗi khi các gói dịch vụ thay đổi
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

  //   hàm onBookNow để gửi dữ liệu đi
  const onBookNow = () => {
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

    // Chuẩn bị payload sạch, không chứa thông tin giảm giá
    const bookingPayload = {
      tour_id: productData._id,
      tour_title: productData.name,
      // GỬI ĐI GIÁ GỐC CỦA 1 NGƯỜI (đã bao gồm options)
      total_price: pricePerPerson,
      selectedOptions: currentSelectedPackages,
      selectedOptionsDetails,
      image: productData.images[0]?.uri || '',
    };

    setBookingDetails(bookingPayload);
  };

  const clearBookingDetails = () => {
    setBookingDetails(null);
  };

  return {
    productData,
    loading,
    error,
    refreshing,
    // Trả về giá cho 1 người, đã bao gồm các options
    currentTotalPrice: pricePerPerson,
    currentSelectedPackages,
    bookingDetails,
    loadTourDetails,
    onRefresh,
    handleSelectionUpdate,
    onSeeAllReviews,
    onBookNow,
    clearBookingDetails,
  };
};