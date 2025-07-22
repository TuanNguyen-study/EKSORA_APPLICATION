import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { fetchTourDetail } from '../API/services/tourService';
import { useReviewContext } from '../store/ReviewContext';
import { prepareProductInfo, parseDescription, formatPrice } from '../utils/tourDetailHelpers';

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
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  //  Tách state giá thành 2 phần
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState(0); // Giá gốc + options
  const [currentTotalPrice, setCurrentTotalPrice] = useState(0); // Giá cuối cùng sau khi giảm

  // THAY ĐỔI 2: Sửa lại hàm tính giá để cập nhật cả 2 state
  const recalculateTotalPrice = useCallback((packagesMap, voucher) => {
    if (!productData) return;
    
    const basePrice = productData.price.current;
    const optionTotal = Object.values(packagesMap).reduce((sum, optId) => {
      for (const pkg of productData.availableServicePackages) {
        const option = pkg.options.find((opt) => opt.id === optId);
        if (option) return sum + (option.price || 0);
      }
      return sum;
    }, 0);
    
    // Luôn tính và cập nhật giá trước khi giảm
    const totalBeforeDiscount = basePrice + optionTotal;
    setPriceBeforeDiscount(totalBeforeDiscount);

    // Tính giá cuối cùng sau khi áp voucher
    const finalPrice = formatPrice(totalBeforeDiscount, voucher);
    setCurrentTotalPrice(finalPrice);

  }, [productData]); 

  // Các hàm và hook 
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
      setPriceBeforeDiscount(mappedProductData.price.current);
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
  const onRefresh = useCallback(() => {
    if (productId) {
      setRefreshing(true);
      loadTourDetails(productId);
    }
  }, [productId, loadTourDetails]);
  const handleApplyVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    recalculateTotalPrice(currentSelectedPackages, voucher);
  };
  const handleSelectionUpdate = (packagesMap) => {
    setCurrentSelectedPackages(packagesMap);
    recalculateTotalPrice(packagesMap, selectedVoucher);
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

  const onBookNow = () => {
    if (!productData) return;

    // 1. Tính giá gốc của 1 người (bao gồm option)
    const basePrice = productData.price.current || 0;
    const optionTotal = Object.values(currentSelectedPackages).reduce((sum, optId) => {
      for (const pkg of productData.availableServicePackages) {
        const option = pkg.options.find((opt) => opt.id === optId);
        if (option) return sum + (option.price || 0);
      }
      return sum;
    }, 0);
    const pricePerAdultWithOptions = basePrice + optionTotal;
    
    // 2. Tính số tiền thực tế đã giảm
    // `currentTotalPrice` là giá đã giảm, `pricePerAdultWithOptions` là giá gốc
    const discountAmount = pricePerAdultWithOptions - currentTotalPrice;

    // 3. Lấy chi tiết các option đã chọn
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

    // 4. Chuẩn bị payload thông minh
    const bookingPayload = {
      tour_id: productData._id,
      tour_title: productData.name,
      total_price: currentTotalPrice,
      selectedOptions: currentSelectedPackages,
      selectedOptionsDetails,
      image: productData.images[0]?.uri || '',
      voucher_id: selectedVoucher ? selectedVoucher._id : null,
      discount: discountAmount,
    };

    setBookingDetails(bookingPayload);
  };

  const clearBookingDetails = () => {
    setBookingDetails(null);
  };

  return {
    productData, loading, error, refreshing,  priceBeforeDiscount,
    currentTotalPrice,
    currentSelectedPackages, selectedVoucher, bookingDetails,
    loadTourDetails, onRefresh, handleApplyVoucher,
    handleSelectionUpdate, onSeeAllReviews, onBookNow, clearBookingDetails,
  };
};