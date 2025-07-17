import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COLORS } from '../../../../constants/colors';
import BookingFooter from './components/BookingFooter';
import DateSelector from './components/DateSelector';
import QuantitySelector from './components/QuantitySelector';
import styles from './components/styles';
import { useBooking } from '../../../../hooks/useBooking';

export default function BookingScreen() {
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
  } = useBooking();

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
        {image && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image source={{ uri: image }} style={{ width: '100%', height: 180, borderRadius: 12 }} resizeMode="cover" />
          </View>
        )}
        <View style={styles.comboTitleContainer}>
          <Text style={styles.comboTitle} numberOfLines={2}>{tour_title}</Text>
          <TouchableOpacity onPress={() => {}} style={styles.detailButton}>
            <Text style={styles.detailText}>Chi tiết</Text>
            <Ionicons name="chevron-forward-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
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
                {option.optionDescription && <Text style={styles.optionDescription}>{option.optionDescription}</Text>}
                <Text style={styles.optionPrice}>{formatPrice(option.optionPrice)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Vui lòng chọn ngày sử dụng</Text>
          <View style={styles.serviceStatusRow}>
            <Text style={styles.serviceStatusText}>Xem trạng thái dịch vụ</Text>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.dateRangeButton}>
              <Text style={styles.dateRangeText}>Xem Thêm</Text>
              <Ionicons name="chevron-forward-outline" size={18} color={COLORS.darkGray || '#666'} />
            </TouchableOpacity>
          </View>
          <DateSelector
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onOpenCalendar={() => setDatePickerVisible(true)}
          />
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
          <QuantitySelector
            label="Người lớn"
            priceText={formatPrice(adultPrice)}
            quantity={quantityAdult}
            onDecrement={decrementAdult}
            onIncrement={incrementAdult}
          />
          <View style={styles.divider} />
          <QuantitySelector
            label="Trẻ em (5-8 tuổi)"
            priceText={formatPrice(childPrice)}
            quantity={quantityChild}
            onDecrement={decrementChild}
            onIncrement={incrementChild}
          />
        </View>

        {discount > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Voucher đã áp dụng</Text>
            <Text style={styles.discountText}>Giảm: {formatPrice(discount)}</Text>
          </View>
        )}
      </ScrollView>

      <BookingFooter
        totalPrice={formatPrice(finalPrice)}
        onAddToCart={handleAddToCart}
        onBookNow={handleBooking}
      />
    </SafeAreaView>
  );
}