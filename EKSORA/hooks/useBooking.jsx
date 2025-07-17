import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { createBooking } from '../API/services/booking';
import { useCart } from '../store/CartContext';

// Hàm helper 
const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export const useBooking = () => {
  const { addToCart, cartItems } = useCart();

  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = useSelector((state) => state.auth.user?.id);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [quantityAdult, setQuantityAdult] = useState(0); 
  
  const [quantityChild, setQuantityChild] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);

  // --- Lấy và xử lý dữ liệu từ params ---
  const image = typeof params.image === 'string' ? decodeURIComponent(params.image) : '';
  const tour_id = params.tour_id;
  const tour_title = typeof params.tour_title === 'string' ? decodeURIComponent(params.tour_title) : '';
  const selectedOptions = typeof params.selectedOptions === 'string' ? JSON.parse(params.selectedOptions) : {};
  const selectedOptionsDetails = typeof params.selectedOptionsDetails === 'string' ? JSON.parse(params.selectedOptionsDetails) : [];
  const voucher_id = params.voucher_id || null;
  const discount = Number(params.discount || '0');
  
  // --- Tính toán giá ---
  const adultPrice = Number(params.total_price || '0');
  const childPrice = adultPrice * 0.5;
  const finalPriceBeforeDiscount = (adultPrice * quantityAdult) + (childPrice * quantityChild);
  const finalPrice = finalPriceBeforeDiscount - discount;


  // --- useEffect để tạo ngày mặc định ---
  useEffect(() => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      dates.push(formatted);
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  // --- Các hàm xử lý (Handlers) ---
  const incrementAdult = () => setQuantityAdult((q) => q + 1);

  const decrementAdult = () => setQuantityAdult((q) => (q > 0 ? q - 1 : 0)); 
  
  const incrementChild = () => setQuantityChild((q) => q + 1);
  const decrementChild = () => setQuantityChild((q) => (q > 0 ? q - 1 : 0));

  const handleConfirmDate = (date) => {
    const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setSelectedDate(formatted);
    if (!availableDates.includes(formatted)) {
      setAvailableDates((prevDates) => [formatted, ...prevDates.slice(0, 3)]);
    }
    setDatePickerVisible(false);
  };
  
const handleAddToCart = () => {
    if (quantityAdult === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 người lớn.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày để thêm vào giỏ hàng.');
      return;
    }
    
    const cartItemId = `${tour_id}_${selectedDate}`;

    // Kiểm tra xem item đã tồn tại trong giỏ hàng chưa
    const existingItem = cartItems.find(item => item.id === cartItemId);

    if (existingItem) {
      Alert.alert('Thông báo', 'Tour này với ngày đã chọn đã có trong giỏ hàng của bạn.');
      return; 
    }

    // Nếu chưa tồn tại, tiến hành thêm mới
    const cartItem = {
      id: cartItemId,
      tour_id: tour_id,
      name: tour_title,
      image: image,
      travelDate: selectedDate,
      adults: quantityAdult,
      children: quantityChild,
      adultPrice: adultPrice,
      childPrice: childPrice,
      selectedOptions: selectedOptionsDetails,
      price: finalPriceBeforeDiscount,
    };
    addToCart(cartItem);
    Alert.alert('Thành công', `Đã thêm "${tour_title}" vào giỏ hàng!`);
  };

  const handleBooking = async () => {
    if (quantityAdult === 0) {
        Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 người lớn để đặt tour.');
        return;
    }

    if (!selectedDate) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày tham gia!');
      return;
    }
    if (!userId) {
      Alert.alert('Lỗi', 'Không tìm thấy người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    const [day, month, year] = selectedDate.split('/');
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const bookingData = {
      user_id: userId,
      tour_id,
      travel_date: formattedDate,
      quantity_nguoiLon: quantityAdult,
      quantity_treEm: quantityChild,
      price_nguoiLon: adultPrice,
      price_treEm: childPrice,
      optionServices: Object.values(selectedOptions).map((id) => ({
        option_service_id: id,
      })),
      coin: 0,
      voucher_id: voucher_id || null,
      discount: discount || 0,
    };

    try {
      const res = await createBooking(bookingData);
      const bookingId = res?.booking_id || res?.booking?._id;
      if (!bookingId) {
        Alert.alert('Lỗi', 'Không thể lấy mã đơn hàng. Vui lòng thử lại.');
        return;
      }
      router.push({
        pathname: '/acount/BookingCompleted',
        params: {
          bookingId,
          title: tour_title,
          quantityAdult: quantityAdult.toString(),
          quantityChild: quantityChild.toString(),
          totalPrice: finalPrice.toString(),
          travelDate: selectedDate,
          image: image || '',
        },
      });
    } catch (error) {
      console.error('Lỗi khi tạo booking:', error.message || error);
      Alert.alert('Lỗi', 'Đặt tour thất bại. Vui lòng thử lại.');
    }
  };

  return {
    image,
    tour_title,
    selectedOptionsDetails,
    availableDates,
    selectedDate,
    quantityAdult,
    quantityChild,
    adultPrice,
    childPrice,
    discount,
    finalPrice,
    isDatePickerVisible,
    router,
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
  };
};