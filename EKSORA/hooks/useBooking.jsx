import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { createBooking } from '../API/services/booking';
import { useCart } from '../store/CartContext';

// --- Hàm helper ---
const formatPrice = (price) => {
  const value = typeof price === 'number' ? price : 0;
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const useBooking = (initialDetails) => {
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  const userId = useSelector((state) => state.auth.user?.id);

  // --- State nội bộ của hook ---
  const [tourData, setTourData] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [quantityAdult, setQuantityAdult] = useState(0);
  const [quantityChild, setQuantityChild] = useState(0);
  const [originalPrices, setOriginalPrices] = useState({ adult: 0, child: 0 });
  const [displayPrices, setDisplayPrices] = useState({ adult: 0, child: 0 });
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);

  // --- KHỞI TẠO STATE ---
  useEffect(() => {
    if (initialDetails) {
      const adultBasePrice = initialDetails.total_price || 0;
      const childBasePrice = adultBasePrice * 0.7;
      setTourData({
        tour_id: initialDetails.tour_id,
        tour_title: initialDetails.tour_title,
        image: initialDetails.image,
        selectedOptions: initialDetails.selectedOptions,
        selectedOptionsDetails: initialDetails.selectedOptionsDetails,
      });
      setOriginalPrices({ adult: adultBasePrice, child: childBasePrice });
      setDisplayPrices({ adult: adultBasePrice, child: childBasePrice });
      setQuantityAdult(1);
      setQuantityChild(0);
      setAppliedVoucher(null);
      setDiscountAmount(0);
      const today = new Date();
      const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      });
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    }
  }, [initialDetails]);

  // --- HÀM ÁP DỤNG VOUCHER ---
  const applyVoucher = useCallback((voucher) => {
    setAppliedVoucher(voucher);
  }, []);

  // --- EFFECT CHÍNH: TÍNH TOÁN LẠI MỌI THỨ KHI CÓ THAY ĐỔI ---
useEffect(() => {
  const totalBeforeDiscount = originalPrices.adult * quantityAdult + originalPrices.child * quantityChild;

  if (!appliedVoucher) {
    setDiscountAmount(0);
    setDisplayPrices(originalPrices);
    setFinalPrice(totalBeforeDiscount);
    return;
  }

  if (!appliedVoucher.voucher_id || typeof appliedVoucher.voucher_id.discount === 'undefined') {
    setDiscountAmount(0);
    setDisplayPrices(originalPrices);
    setFinalPrice(totalBeforeDiscount);
    return;
  }

  if (totalBeforeDiscount < appliedVoucher.voucher_id.min_order_value) {
    setDiscountAmount(0);
    setDisplayPrices(originalPrices);
    setFinalPrice(totalBeforeDiscount);
    return;
  }

  let calculatedDiscount = 0;
  let voucherType = appliedVoucher.voucher_id.discount_type
    ? appliedVoucher.voucher_id.discount_type.toLowerCase()
    : '';
  const discountValue = appliedVoucher.voucher_id.discount;

  if (!voucherType) {
    if (discountValue > 0 && discountValue <= 100) voucherType = 'percentage';
    else voucherType = 'fixed_amount';
  }

  if (voucherType === 'percentage') {
    calculatedDiscount = totalBeforeDiscount * (discountValue / 100);
    if (appliedVoucher.voucher_id.max_discount_value) {
      calculatedDiscount = Math.min(calculatedDiscount, appliedVoucher.voucher_id.max_discount_value);
    }
  } else {
    calculatedDiscount = discountValue;
  }

  calculatedDiscount = Math.min(calculatedDiscount, totalBeforeDiscount);
  setDiscountAmount(calculatedDiscount);

  // Sửa lại logic phân bổ giảm giá
  let newAdultPrice = originalPrices.adult;
  let newChildPrice = originalPrices.child;

  if (totalBeforeDiscount > 0) {
    // Tính tỷ lệ giảm giá dựa trên tổng giá vé
    const discountRatio = calculatedDiscount / totalBeforeDiscount;
    newAdultPrice = originalPrices.adult * (1 - discountRatio);
    newChildPrice = originalPrices.child * (1 - discountRatio);
  }

  // Đảm bảo giá không âm
  newAdultPrice = Math.max(newAdultPrice, 0);
  newChildPrice = Math.max(newChildPrice, 0);

  setDisplayPrices({ adult: newAdultPrice, child: newChildPrice });
  setFinalPrice(totalBeforeDiscount - calculatedDiscount);
}, [quantityAdult, quantityChild, originalPrices, appliedVoucher]);

  // --- Các hàm xử lý (Handlers) ---
  const incrementAdult = () => setQuantityAdult((q) => q + 1);
  const decrementAdult = () => setQuantityAdult((q) => (q > 0 ? q - 1 : 0));
  const incrementChild = () => setQuantityChild((q) => q + 1);
  const decrementChild = () => setQuantityChild((q) => (q > 0 ? q - 1 : 0));

  
  const handleConfirmDate = (date) => {
    setDatePickerVisible(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      Alert.alert("Ngày không hợp lệ", "Bạn không thể đặt lịch cho một ngày trong quá khứ. Vui lòng chọn lại.");
      return;
    }
    const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setSelectedDate(formatted);
    if (!availableDates.includes(formatted)) {
      setAvailableDates(prev => {
        const newDates = [formatted, ...prev.filter(d => d !== formatted)];
        newDates.sort((a, b) => parseDateString(a) - parseDateString(b));
        return newDates;
      });
    }
  };

 //  logic trong handleAddToCart để lấy giá đúng
  const handleAddToCart = () => {
    if (quantityAdult === 0 && quantityChild === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số lượng người lớn hoặc trẻ em.');
      return;
    }
    if (!tourData) return;
    const cartItemId = `${tourData.tour_id}_${selectedDate}`;
    if (cartItems.find(item => item.id === cartItemId)) {
      Alert.alert('Thông báo', 'Tour này với ngày đã chọn đã có trong giỏ hàng.');
      return;
    }

    const cartItem = {
      id: cartItemId,
      tour_id: tourData.tour_id,
      name: tourData.tour_title,
      image: tourData.image,
      travelDate: selectedDate,
      adults: quantityAdult,
      children: quantityChild,
      adultPrice: originalPrices.adult, 
      childPrice: originalPrices.child, 
      selectedOptions: tourData.selectedOptionsDetails,
      price: (originalPrices.adult * quantityAdult) + (originalPrices.child * quantityChild), 
    };
    addToCart(cartItem);
    Alert.alert('Thành công', `Đã thêm "${tourData.tour_title}" vào giỏ hàng!`);
  };

  const handleBooking = async () => {
    if (quantityAdult === 0 && quantityChild === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số lượng người lớn hoặc trẻ em để đặt tour.');
      return;
    }
    if (!tourData || !selectedDate || !userId) {
      Alert.alert('Lỗi', 'Dữ liệu không hợp lệ hoặc bạn chưa đăng nhập. Vui lòng thử lại.');
      return;
    }
    const [day, month, year] = selectedDate.split('/');
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const bookingData = {
      user_id: userId,
      tour_id: tourData.tour_id,
      travel_date: formattedDate,
      quantity_nguoiLon: quantityAdult,
      quantity_treEm: quantityChild,
      price_nguoiLon: originalPrices.adult,
      price_treEm: originalPrices.child,
      optionServices: Object.values(tourData.selectedOptions).map((id) => ({
        option_service_id: id,
      })),
      coin: 0,
      voucher_id: appliedVoucher ? appliedVoucher.voucher_id._id : null,
      discount: discountAmount,
    };
    try {
      const res = await createBooking(bookingData);
      const bookingId = res?.booking_id || res?.booking?._id;
      if (!bookingId) throw new Error('Không nhận được mã đơn hàng.');
      router.push({
        pathname: '/BookingCompleted',
        params: {
          bookingId,
          title: tourData.tour_title,
          quantityAdult: quantityAdult.toString(),
          quantityChild: quantityChild.toString(),
          totalPrice: finalPrice.toString(),
          travelDate: selectedDate,
          image: tourData.image || '',
        },
      });
    } catch (error) {
      console.error('Lỗi khi tạo booking:', error.message || error);
      Alert.alert('Lỗi', 'Đặt tour thất bại. Vui lòng thử lại.');
    }
  };

  return {
    image: tourData?.image,
    tour_title: tourData?.tour_title,
    selectedOptionsDetails: tourData?.selectedOptionsDetails || [],
    availableDates,
    selectedDate,
    quantityAdult,
    quantityChild,
    adultPrice: displayPrices.adult,
    childPrice: displayPrices.child,
    discount: discountAmount,
    finalPrice,
    isDatePickerVisible,
    formatPrice,
    setSelectedDate,
    setDatePickerVisible,
    handleConfirmDate,
    incrementAdult,
    decrementAdult,
    incrementChild,
    decrementChild,
    handleAddToCart,
    handleBooking,
    applyVoucher,
    appliedVoucher,
  };
};