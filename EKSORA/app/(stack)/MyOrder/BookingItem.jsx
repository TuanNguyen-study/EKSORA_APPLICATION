import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

// const statusConfig = {
//   confirmed: { text: 'ĐÃ XÁC NHẬN', color: COLORS.success, icon: 'check-circle' },
//   pending: { text: 'ĐANG CHỜ XỬ LÝ', color: COLORS.warning, icon: 'clock-time-eight' },
//   cancelled: { text: 'ĐÃ HỦY', color: COLORS.danger, icon: 'close-circle' },
//   default: { text: 'KHÔNG RÕ', color: COLORS.grey, icon: 'help-circle' },
// };

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const BookingItem = ({ item, onPress }) => {
  const {
    tour_id,
    travel_date,
    totalPrice,
    _id,
    status,
    quantity_nguoiLon,
    quantity_treEm,
    price_nguoiLon,
    price_treEm
  } = item;

  const imageUrl = tour_id.image?.[0];
  const statusConfig = {
  paid: { text: 'ĐÃ XÁC NHẬN', color: COLORS.success, icon: 'check-circle' },
  pending: { text: 'ĐANG CHỜ XÁC NHẬN', color: COLORS.warning, icon: 'clock-time-eight' },
  confirmed: { text: 'ĐÃ GIỮ CHỖ', color: COLORS.success, icon: 'calendar-check' },
  canceled: { text: 'ĐÃ HỦY', color: COLORS.danger, icon: 'close-circle' },
  refund_requested: { text: 'YÊU CẦU HOÀN TIỀN', color: COLORS.warning, icon: 'cash-refund' },
  refunded: { text: 'ĐÃ HOÀN TIỀN', color: COLORS.success, icon: 'cash-multiple' },
  expired: { text: 'HẾT HẠN', color: COLORS.grey, icon: 'calendar-remove' },
  failed: { text: 'THANH TOÁN LỖI', color: COLORS.danger, icon: 'alert-circle-outline' }, // chỉ thêm nếu dùng
  default: { text: 'KHÔNG RÕ', color: COLORS.grey, icon: 'help-circle' },
};

  const currentStatus = statusConfig[status?.toLowerCase()] || statusConfig.default;
  return (
    <Pressable style={styles.card} onPress={() => onPress(item)}>
      <ImageBackground
        source={{ uri: imageUrl || 'https://via.placeholder.com/400x200.png?text=Image' }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.imageOverlay}>
          <View style={[styles.statusBadge, { backgroundColor: currentStatus.color }]}>
            <MaterialCommunityIcons name={currentStatus.icon} size={14} color={COLORS.white} />
            <Text style={styles.statusText}>{currentStatus.text}</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.detailsContainer}>
        <Text style={styles.tourName} numberOfLines={2}>{tour_id.name}</Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-check" size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>Ngày đi: {formatDate(travel_date)}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="barcode-scan" size={18} color={COLORS.primary} />
          {/* <Text style={styles.infoText}>Mã đơn: ...{_id.slice(-6).toUpperCase()}</Text> */}
          <Text style={styles.infoText}>Mã đơn: {item.order_code || 'Chưa có'}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account-multiple" size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Người lớn: {quantity_nguoiLon} x {formatPrice(price_nguoiLon)} | Trẻ em: {quantity_treEm} x {formatPrice(price_treEm)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
          <Text style={styles.detailsButton}>Xem chi tiết</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBackground: { height: 120, justifyContent: 'flex-end' },
  imageStyle: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  imageOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 5,
  },
  detailsContainer: { padding: 12 },
  tourName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: { fontSize: 13, color: COLORS.grey, marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailsButton: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default BookingItem;
