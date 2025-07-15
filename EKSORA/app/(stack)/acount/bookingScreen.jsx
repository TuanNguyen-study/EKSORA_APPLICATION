import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector } from 'react-redux';
import { createBooking } from '../../../API/services/booking';
import { COLORS } from '../../../constants/colors';
import { useCart } from '../../../store/CartContext';
import styles from './styles';

export default function BookingScreen() {
  const { addToCart } = useCart();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // Lấy thông tin từ params
  const adultPrice = Number(params.total_price || '0');
  const image = typeof params.image === 'string' ? decodeURIComponent(params.image) : '';
  const tour_id = params.tour_id;
  const tour_title = typeof params.tour_title === 'string' ? decodeURIComponent(params.tour_title) : '';
  const selectedOptions = typeof params.selectedOptions === 'string' ? JSON.parse(params.selectedOptions) : {};
  const selectedOptionsDetails = typeof params.selectedOptionsDetails === 'string' ? JSON.parse(params.selectedOptionsDetails) : [];
  const voucher_id = params.voucher_id || null;
  const discount = Number(params.discount || '0');
  const userId = useSelector(state => state.auth.user?.id);

  const [selectedDate, setSelectedDate] = useState(null);
  const [quantityAdult, setQuantityAdult] = useState(1);
  const [quantityChild, setQuantityChild] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const DEFAULT_CHILD_PRICE = 1500;

  const optionsTotalPrice = useMemo(() => {
    if (!selectedOptionsDetails || selectedOptionsDetails.length === 0) {
      return 0;
    }
    return selectedOptionsDetails.reduce((total, option) => total + (option.optionPrice || 0), 0);
  }, [selectedOptionsDetails]);

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

  const incrementAdult = () => setQuantityAdult((q) => q + 1);
  const decrementAdult = () => setQuantityAdult((q) => (q > 1 ? q - 1 : 1));
  const incrementChild = () => setQuantityChild((q) => q + 1);
  const decrementChild = () => setQuantityChild((q) => (q > 0 ? q - 1 : 0));

  const formatPrice = (price) =>
    price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const finalPriceBeforeDiscount =
    (adultPrice * quantityAdult) +
    (DEFAULT_CHILD_PRICE * quantityChild) +
    optionsTotalPrice;

  const handleAddToCart = () => {
    if (!selectedDate) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày để thêm vào giỏ hàng.');
      return;
    }

    const cartItemId = `${tour_id}_${selectedDate}`;

    // Tạo đối tượng item để thêm vào giỏ hàng
    const cartItem = {
      id: cartItemId, 
      tour_id: tour_id,
      name: tour_title,
      image: image,
      travelDate: selectedDate,
      adults: quantityAdult,
      children: quantityChild,
      adultPrice: adultPrice,
      childPrice: DEFAULT_CHILD_PRICE,
      selectedOptions: selectedOptionsDetails,
      price: finalPriceBeforeDiscount, 
    };

    addToCart(cartItem);
    Alert.alert('Thành công', `Đã thêm "${tour_title}" vào giỏ hàng!`);
  };
  const handleBooking = async () => {
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
      price_treEm: DEFAULT_CHILD_PRICE,
      optionServices: Object.values(selectedOptions).map(id => ({
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
          totalPrice: (finalPriceBeforeDiscount - discount).toString(),
          travelDate: selectedDate,
          image: image || '',
        },
      });
    } catch (error) {
      console.error('Lỗi khi tạo booking:', error.message || error);
      Alert.alert('Lỗi', 'Đặt tour thất bại. Vui lòng thử lại.');
    }
  };

  const handleConfirmDate = (date) => {
    const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setSelectedDate(formatted);
    if (!availableDates.includes(formatted)) {
      setAvailableDates(prevDates => [formatted, ...prevDates.slice(0, 3)]);
    }
    setDatePickerVisible(false);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tùy chọn đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {image ? (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: 180, borderRadius: 12 }}
              resizeMode="cover"
            />
          </View>
        ) : null}
        <View style={styles.comboTitleContainer}>
          <Text style={styles.comboTitle} numberOfLines={2}>
            {tour_title}
          </Text>
          <TouchableOpacity onPress={() => { }} style={styles.detailButton}>
            <Text style={styles.detailText}>Chi tiết</Text>
            <Ionicons name="chevron-forward-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.badgesContainer}>
          <TouchableOpacity style={styles.badge} onPress={() => { }}>
            <Text style={styles.badgeText}>Hủy miễn phí 24 giờ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.badge} onPress={() => { }}>
            <Text style={styles.badgeText}>Xác nhận tức thời</Text>
          </TouchableOpacity>
        </View>

        {selectedOptionsDetails.length > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              Tùy chọn dịch vụ đã chọn
            </Text>
            {selectedOptionsDetails.map((option, index) => (
              <View key={index} style={styles.optionItem}>
                <Text style={styles.optionTitle}>{option.title}: {option.optionName}</Text>
                {option.optionDescription && (
                  <Text style={styles.optionDescription}>{option.optionDescription}</Text>
                )}
                <Text style={styles.optionPrice}>{formatPrice(option.optionPrice)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Vui lòng chọn ngày sử dụng</Text>
          <View style={styles.serviceStatusRow}>
            <Text style={styles.serviceStatusText}>Xem trạng thái dịch vụ</Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateRangeButton}
            >
              <Text style={styles.dateRangeText}>15/7 - 31/12</Text>
              <Ionicons name="chevron-forward-outline" size={18} color={COLORS.darkGray || '#666'} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelectorScrollView}>
            {availableDates.map((date, index) => {
              const [day, month] = date.split('/');
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateButton, selectedDate === date && styles.dateButtonSelected,]}
                  onPress={() => handleSelectDate(date)}
                >
                  <Text style={[styles.dateButtonText, selectedDate === date && styles.dateButtonTextSelected,]}>
                    {`${day}/${month}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.dateButton, styles.dateButtonDisabled]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisible(false)}
          locale="vi_VN"
          confirmTextIOS="Xác nhận"
          cancelTextIOS="Hủy"
        />

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Chọn số lượng</Text>
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Người lớn</Text>
            <Text style={styles.priceText}>{formatPrice(adultPrice)}</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={decrementAdult} style={styles.quantityButton}>
                <Ionicons name="remove-circle-outline" size={28} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantityAdult}</Text>
              <TouchableOpacity onPress={incrementAdult} style={styles.quantityButton}>
                <Ionicons name="add-circle-outline" size={28} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Trẻ em (5-8 tuổi)</Text>
            <Text style={styles.priceText}>{formatPrice(DEFAULT_CHILD_PRICE)}</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={decrementChild} style={styles.quantityButton}>
                <Ionicons name="remove-circle-outline" size={28} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantityChild}</Text>
              <TouchableOpacity onPress={incrementChild} style={styles.quantityButton}>
                <Ionicons name="add-circle-outline" size={28} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {discount > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              Voucher đã áp dụng
            </Text>
            <Text style={styles.discountText}>
              Giảm: {formatPrice(discount)}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTopRow}>
          <Text style={styles.totalPriceLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>{formatPrice(finalPriceBeforeDiscount - discount)}</Text>
        </View>
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookNowButton} onPress={handleBooking}>
            <Text style={styles.bookNowButtonText}>Đặt ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}