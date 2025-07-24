import { useEffect, useState } from 'react';
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
 

  // Thay đổi giá trị mặc định của quantityAdult 
  const [quantityAdult, setQuantityAdult] = useState(0); 
  const [quantityChild, setQuantityChild] = useState(0);

  const [availableDates, setAvailableDates] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

  // Dùng useEffect để khởi tạo state từ `initialDetails` khi modal được mở
  useEffect(() => {
    if (initialDetails) {
      setTourData({
        tour_id: initialDetails.tour_id,
        tour_title: initialDetails.tour_title,
        image: initialDetails.image,
        selectedOptions: initialDetails.selectedOptions,
        selectedOptionsDetails: initialDetails.selectedOptionsDetails,
        adultPrice: initialDetails.total_price,
        childPrice: (initialDetails.total_price || 0) * 0.7,
        voucher_id: initialDetails.voucher_id,
        discount: initialDetails.discount,
      });

  
      setQuantityAdult(0);
      setQuantityChild(0);
      

      // Tạo một danh sách các ngày trong 30 ngày tới
      const today = new Date();
      const dates = [];
      for (let i = 0; i < 30; i++) { // Tạo 30 ngày để cuộn
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        // Định dạng ngày thành "dd/mm/yyyy"
        const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dates.push(formatted);
      }
      setAvailableDates(dates);
      
      // Chọn ngày đầu tiên trong danh sách làm ngày mặc định
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    }
  }, [initialDetails]);

  // Dùng useEffect riêng để tính toán lại tổng tiền mỗi khi số lượng hoặc dữ liệu tour thay đổi
  useEffect(() => {
    if (tourData) {
      const totalBeforeDiscount = (tourData.adultPrice * quantityAdult) + (tourData.childPrice * quantityChild);
      const finalTotal = totalBeforeDiscount - tourData.discount;
      setFinalPrice(Math.max(0, finalTotal));
    } else {
      setFinalPrice(0); 
    }
  }, [quantityAdult, quantityChild, tourData]);


  // --- Các hàm xử lý (Handlers) ---
  const incrementAdult = () => setQuantityAdult((q) => q + 1);
  
  // Sửa lại logic decrement để có thể giảm về 0
  const decrementAdult = () => setQuantityAdult((q) => (q > 0 ? q - 1 : 0)); 
  
  const incrementChild = () => setQuantityChild((q) => q + 1);
  const decrementChild = () => setQuantityChild((q) => (q > 0 ? q - 1 : 0));

  const handleConfirmDate = (date) => {
    const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setSelectedDate(formatted);
    if (!availableDates.includes(formatted)) {
       setAvailableDates(prev => [formatted, ...prev.filter(d => d !== formatted)].sort());
    }
    setDatePickerVisible(false);
  };
  
  const handleAddToCart = () => {
    // Thêm điều kiện kiểm tra số lượng
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
      adultPrice: tourData.adultPrice,
      childPrice: tourData.childPrice,
      selectedOptions: tourData.selectedOptionsDetails,
      price: (tourData.adultPrice * quantityAdult) + (tourData.childPrice * quantityChild),
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
      price_nguoiLon: tourData.adultPrice,
      price_treEm: tourData.childPrice,
      optionServices: Object.values(tourData.selectedOptions).map((id) => ({
        option_service_id: id,
      })),
      coin: 0,
      voucher_id: tourData.voucher_id || null,
      discount: tourData.discount || 0,
    };

    try {
      const res = await createBooking(bookingData);
      const bookingId = res?.booking_id || res?.booking?._id;
      if (!bookingId) throw new Error('Không nhận được mã đơn hàng.');
      
      router.push({
        pathname: '/acount/BookingCompleted',
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
    adultPrice: tourData?.adultPrice || 0,
    childPrice: tourData?.childPrice || 0,
    discount: tourData?.discount || 0,
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
  };
};