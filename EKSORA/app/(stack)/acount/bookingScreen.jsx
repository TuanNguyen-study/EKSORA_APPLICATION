import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSelector } from 'react-redux';
import { createBooking } from "../../../API/services/booking";
import { COLORS } from "../../../constants/colors";
export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showPicker, setShowPicker] = useState(false);

  // Lấy thông tin từ params
  const image = typeof params.image === 'string' ? decodeURIComponent(params.image) : '';
  const tour_id = params.tour_id;
  const tour_title = typeof params.tour_title === 'string' ? decodeURIComponent(params.tour_title) : '';
  const total_price = Number(params.total_price || '0');
  const selectedOptions = typeof params.selectedOptions === 'string' ? JSON.parse(params.selectedOptions) : {};
  const voucher_id = params.voucher_id || null;
  const discount = Number(params.discount || '0'); // Vẫn giữ để truyền sang BookingCompleted
  const userId = useSelector(state => state.auth.user?.id);

  console.log('▶️ tour_title:', tour_title);
  console.log('▶️ total_price:', total_price);
  console.log('▶️ selectedOptions:', selectedOptions);
  console.log('▶️ voucher_id:', voucher_id);
  console.log('▶️ discount:', discount);

  const [selectedDate, setSelectedDate] = useState(null);
  const [quantityAdult, setQuantityAdult] = useState(0);
  const [quantityChild, setQuantityChild] = useState(0);
  const DEFAULT_ADULT_PRICE = 300000;
  const DEFAULT_CHILD_PRICE = 150000;

  const incrementAdult = () => setQuantityAdult((q) => q + 1);
  const decrementAdult = () => setQuantityAdult((q) => (q > 0 ? q - 1 : q));
  const incrementChild = () => setQuantityChild((q) => q + 1);
  const decrementChild = () => setQuantityChild((q) => (q > 0 ? q - 1 : q));

  const formatPrice = (price) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Tính giá cuối cùng: chỉ thêm giá người lớn và trẻ em
  const finalPrice =
    total_price +
    (quantityAdult * DEFAULT_ADULT_PRICE) +
    (quantityChild * DEFAULT_CHILD_PRICE);

  const handleBooking = async () => {
    if (!selectedDate) {
      Alert.alert("Vui lòng chọn ngày tham gia!");
      return;
    }

    if (quantityAdult === 0 && quantityChild === 0) {
      Alert.alert("Bạn phải chọn ít nhất 1 người để đặt tour!");
      return;
    }

    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy user. Vui lòng đăng nhập lại.");
      return;
    }

    // Convert ngày dd/mm/yyyy -> yyyy-mm-dd
    const [day, month, year] = selectedDate.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    const bookingData = {
      user_id: userId,
      tour_id,
      travel_date: formattedDate,
      quantity_nguoiLon: quantityAdult,
      quantity_treEm: quantityChild,
      price_nguoiLon: DEFAULT_ADULT_PRICE,
      price_treEm: DEFAULT_CHILD_PRICE,
      optionServices: Object.values(selectedOptions).map(id => ({
        option_service_id: id
      })),
      coin: 0,
      voucher_id: voucher_id || null,
      discount: discount || 0,
    };

    console.log("📤 bookingData sắp gửi:", JSON.stringify(bookingData, null, 2));

    try {
      await createBooking(bookingData);
      Alert.alert("Thông báo", "Chuyển đến phần hoàn tất đơn hàng!");
      router.push({
        pathname: "/acount/BookingCompleted",
        params: {
          title: tour_title,
          quantityAdult: quantityAdult.toString(),
          quantityChild: quantityChild.toString(),
          totalPrice: finalPrice.toString(),
          travelDate: selectedDate,
          image: image || '',
          voucher_id: voucher_id || '',
          discount: discount.toString(),
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
      Alert.alert("Lỗi", "Đặt tour thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tùy chọn đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
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

        <View style={styles.sectionBox}>
          <View style={styles.badgesContainer}>
            <Text style={[styles.badgeText, { fontWeight: 'bold', color: 'black', fontSize: 20 }]}>Xin chọn ngày tham gia</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusRow}>
            <Text style={[styles.sectionLabel, { fontWeight: 'bold', color: 'black', fontSize: 16 }]}>Xem trạng thái dịch vụ</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[
              styles.datePickerButton,
              selectedDate && styles.datePickerSelected,
            ]}
          >
            <Text style={styles.datePickerText}>
              {selectedDate ? selectedDate : "Chọn ngày"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  const d = new Date(date);
                  const formatted = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                  setSelectedDate(formatted);
                }
              }}
            />
          )}
        </View>

        <View style={styles.sectionBox}>
          <View style={styles.section}>
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Người lớn</Text>
              <Text style={styles.priceText}>{formatPrice(DEFAULT_ADULT_PRICE)}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity onPress={decrementAdult} style={styles.quantityButton}>
                  <Ionicons name="remove-circle-outline" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantityAdult}</Text>
                <TouchableOpacity onPress={incrementAdult} style={styles.quantityButton}>
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Trẻ em(5-8)</Text>
              <Text style={styles.priceText}>{formatPrice(DEFAULT_CHILD_PRICE)}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity onPress={decrementChild} style={styles.quantityButton}>
                  <Ionicons name="remove-circle-outline" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantityChild}</Text>
                <TouchableOpacity onPress={incrementChild} style={styles.quantityButton}>
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Hiển thị thông tin voucher nếu có */}
        {discount > 0 && (
          <View style={styles.sectionBox}>
            <Text style={[styles.sectionLabel, { fontWeight: 'bold', color: 'black', fontSize: 16 }]}>
              Voucher đã áp dụng
            </Text>
            <Text style={styles.priceText}>
              Giảm: {formatPrice(discount)}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.topRow}>
          <Text style={styles.totalPrice}>{formatPrice(finalPrice)}</Text>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardText}>EKSORA Xu +28</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookNowButton} onPress={handleBooking}>
          <Text style={styles.bookNowButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, top: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black
  },


  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },


  comboTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  comboTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8
  },


  detailText: {

    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "bold"
  },

  section: {
    marginBottom: 24
  },

  sectionBox: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },


  badgesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  badge: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: COLORS.white,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.gray,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginBottom: 12,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
    color: COLORS.black,
  },

  buttontextoption: {
    width: 100,
    height: 30,
    fontSize: 14,
    fontWeight: "bold",
    justifyContent: '',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: 8,
  },


  statusText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8
  },


  dateScroll:
    { flexGrow: 0 },

  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: 8,
  },
  dateButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateButtonText: { fontSize: 14, color: COLORS.gray },
  dateButtonTextSelected: { color: COLORS.white },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quantityLabel: { fontSize: 14, fontWeight: "bold", flex: 1 },
  priceText: { fontSize: 14, color: COLORS.black, width: 100, textAlign: "right" },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    paddingHorizontal: 8,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    bottom: 30,
    borderTopColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  rewardBadge: {
    backgroundColor: '#C5F1C5', // xanh lá nhạt
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    color: '#008000', // xanh đậm
    fontWeight: 'bold',
    fontSize: 12,
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
  },
  bookNowButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#4A90E2', // Viền xanh nhẹ
    backgroundColor: '#E6F0FA', // Nền xanh nhạt
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', // Hoặc 'center' nếu bạn muốn căn giữa toàn bộ
    marginTop: 8,
  },

  datePickerText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerSelected: {
    backgroundColor: '#D8EBFF', // xanh nhạt hơn khi đã chọn
  }




});
