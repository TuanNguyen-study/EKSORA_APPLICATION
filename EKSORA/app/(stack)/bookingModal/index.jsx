import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS } from "../../../constants/colors";
import { useBooking } from "../../../hooks/useBooking";
import BookingFooter from "./components/BookingFooter";
import DateSelector from "./components/DateSelector";
import QuantitySelector from "./components/QuantitySelector";
import styles from "./components/styles";
import VoucherModal from "../Voucher/components/VoucherModal";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function BookingModal({ onClose, bookingDetails }) {
  const {
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
  } = useBooking(bookingDetails);

  const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debug loading state
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);

  // Lưu booking state khi component mount và khi có thay đổi
  useEffect(() => {
    if (bookingDetails) {
      saveBookingState();
    }
  }, [selectedOptionsDetails, selectedDate, quantityAdult, quantityChild, appliedVoucher]);

  // Lưu trạng thái booking vào AsyncStorage
  const saveBookingState = async () => {
    try {
      const bookingState = {
        bookingDetails,
        selectedOptionsDetails,
        selectedDate,
        quantityAdult,
        quantityChild,
        appliedVoucher,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem('tempBookingData', JSON.stringify(bookingState));
    } catch (error) {
      console.log('Error saving booking state:', error);
    }
  };

  // Lưu dữ liệu
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Xử lý lỗi
    }
  };

  // Lấy dữ liệu
  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      // Xử lý lỗi
      return null;
    }
  };

  // Xóa dữ liệu
  const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // Xử lý lỗi
    }
  };

  if (!bookingDetails) {
    return null;
  }

  const handleApplyVoucher = (voucher) => {
    if (applyVoucher) {
      applyVoucher(voucher);
    }
    setVoucherModalVisible(false);
  };

  const handleBookNowAndClose = async () => {
    console.log('handleBookNowAndClose called - setting loading to true');
    setLoading(true);
    
    try {
      // Xóa temp data trước khi booking
      await AsyncStorage.removeItem('tempBookingData');
      
      // Thực hiện booking TRƯỚC KHI đóng modal
      await handleBooking();
      
      // Giả lập thời gian xử lý để user thấy được loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Booking completed, closing modal');
      
      // Sau khi hoàn thành mới đóng modal
      onClose();
      
    } catch (error) {
      console.error('Booking error:', error);
      // Nếu có lỗi, vẫn đóng modal sau một thời gian
      setTimeout(() => {
        onClose();
      }, 500);
    } finally {
      // Tắt loading
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const handleCloseModal = () => {
    // Không cho đóng modal khi đang loading
    if (!loading) {
      onClose();
    }
  };

  const handleAddToCartAndClose = async () => {
    // Kiểm tra xem đã chọn đủ yêu cầu chưa
    if (!selectedDate || (quantityAdult === 0 && quantityChild === 0)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn ngày sử dụng và số lượng người.",
        position: "top",
        visibilityTime: 2000,
        topOffset: 50, // Đảm bảo toast hiển thị trong modal
      });
      return; // Không đóng modal
    }

    try {
      await handleAddToCart(); // Gọi hàm gốc để thêm vào giỏ hàng
      onClose(); // Đóng modal
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đã thêm vào giỏ hàng",
          position: "top",
          visibilityTime: 2000,
        });
      }, 300); // Delay để đảm bảo modal đóng xong trước khi hiển thị toast
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error.message || error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2:
          error.message || "Không thể thêm vào giỏ hàng. Vui lòng thử lại.",
        position: "top",
        visibilityTime: 2000,
        topOffset: 50, // Hiển thị trong modal nếu có lỗi
      });
      return; // Không đóng modal nếu có lỗi
    }
  };

  return (
    <SafeAreaView style={[styles.container, { height: '100%' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
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
        {image && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image source={{ uri: image }} style={{ width: '100%', height: 180, borderRadius: 12 }} resizeMode="cover" />
          </View>
        )}
        <View style={styles.comboTitleContainer}>
          <Text style={styles.comboTitle} numberOfLines={2}>{tour_title}</Text>
        </View>

        <View style={styles.badgesContainer}>
          <TouchableOpacity style={styles.badge}><Text style={styles.badgeText}>Hủy miễn phí 24 giờ</Text></TouchableOpacity>
          <TouchableOpacity style={styles.badge}><Text style={styles.badgeText}>Xác nhận tức thời</Text></TouchableOpacity>
        </View>

        {selectedOptionsDetails.length > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Tùy chọn dịch vụ đã chọn</Text>
            {selectedOptionsDetails.map((option, index) => (
              <View key={index} style={styles.optionItem}>
                <Text style={styles.optionTitle}>{option.title}: {option.optionName}</Text>
                {option.optionDescription && (<Text style={styles.optionDescription}>{option.optionDescription}</Text>)}
                <Text style={styles.optionPrice}>{formatPrice(option.optionPrice)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Vui lòng chọn ngày sử dụng</Text>
          <DateSelector availableDates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} onOpenCalendar={() => setDatePickerVisible(true)} />
        </View>

        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={() => setDatePickerVisible(false)} locale="vi_VN" confirmTextIOS="Xác nhận" cancelTextIOS="Hủy" date={new Date()} />

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Chọn số lượng</Text>
          <QuantitySelector label="Người lớn" priceText={formatPrice(adultPrice)} quantity={quantityAdult} onDecrement={decrementAdult} onIncrement={incrementAdult} />
          <View style={styles.divider} />
          <QuantitySelector label="Trẻ em (5-8 tuổi)" priceText={formatPrice(childPrice)} quantity={quantityChild} onDecrement={decrementChild} onIncrement={incrementChild} />
        </View>

        {/* <View style={styles.sectionBox}>

          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <TouchableOpacity style={styles.voucherButton} onPress={() => setVoucherModalVisible(true)}>
            {appliedVoucher ? (
              <Text style={styles.voucherSelectedText}>{appliedVoucher.voucher_id.code}</Text>
            ) : (
              <Text style={styles.voucherPlaceholder}>Chọn hoặc nhập mã</Text>
            )}
            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View> */}

        {discount > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Chiết khấu</Text>
            <Text style={styles.discountText}>Đã giảm: {formatPrice(discount)}</Text>
          </View>
        )}
      </ScrollView>

      <BookingFooter totalPrice={formatPrice(finalPrice)} onAddToCart={handleAddToCart} onBookNow={handleBookNowAndClose} />

      <VoucherModal visible={isVoucherModalVisible} onClose={() => setVoucherModalVisible(false)} onApplyVoucher={handleApplyVoucher} selectedVoucher={appliedVoucher} />

    </SafeAreaView>
  );
}
