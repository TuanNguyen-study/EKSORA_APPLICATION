import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { cancelBookingById, getBookingDetailById } from '../../../API/services/bookingdetailService';
import { COLORS } from '../../../constants/colors';

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    const statusConfig = {
        paid: { text: 'ĐÃ XÁC NHẬN', color: COLORS.success, icon: 'check-circle' },
        pending: { text: 'ĐANG CHỜ THANH TOÁN', color: COLORS.warning, icon: 'clock-time-eight' },
        confirmed: { text: 'ĐÃ GIỮ CHỖ', color: COLORS.success, icon: 'calendar-check' },
        canceled: { text: 'ĐÃ HỦY', color: COLORS.danger, icon: 'close-circle' },
        refund_requested: { text: 'YÊU CẦU HOÀN TIỀN', color: COLORS.warning, icon: 'cash-refund' },
        refunded: { text: 'ĐÃ HOÀN TIỀN', color: COLORS.success, icon: 'cash-multiple' },
        expired: { text: 'HẾT HẠN', color: COLORS.grey, icon: 'calendar-remove' },
        failed: { text: 'THANH TOÁN LỖI', color: COLORS.danger, icon: 'alert-circle-outline' },
        default: { text: 'KHÔNG RÕ', color: COLORS.grey, icon: 'help-circle' },
    };

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const data = await getBookingDetailById(id);
                setBooking(data);
            } catch (err) {
                setError('Không thể tải dữ liệu đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetail();
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!booking) return null;

    const { booking: bk, selected_options = [] } = booking;
    const currentStatus = statusConfig[bk.status?.toLowerCase()] || statusConfig.default;
    const imageUrl = bk.tour_id?.image?.[0];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Hình ảnh + trạng thái */}
            <View style={styles.imageWrapper}>
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
            </View>

            {/* Nội dung chi tiết */}
            <View style={styles.card}>
                <Text style={styles.title}>{bk.tour_id.name}</Text>
                <Text style={styles.label}>Ngày đi: <Text style={styles.value}>{formatDate(bk.travel_date)}</Text></Text>
                <Text style={styles.label}>Tổng tiền: <Text style={styles.value}>{formatPrice(bk.totalPrice)}</Text></Text>
                <Text style={styles.label}>Mã đơn: <Text style={styles.value}>{bk.order_code || 'Chưa có'}</Text></Text>
                <Text style={styles.label}>Người lớn: <Text style={styles.value}>{bk.quantity_nguoiLon} x {formatPrice(bk.price_nguoiLon)}</Text></Text>
                <Text style={styles.label}>Trẻ em: <Text style={styles.value}>{bk.quantity_treEm} x {formatPrice(bk.price_treEm)}</Text></Text>
            </View>

            {/* Dịch vụ đi kèm */}
            {selected_options.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.subTitle}>Dịch vụ đã chọn:</Text>
                    {selected_options.map((opt) => (
                        <View key={opt._id} style={styles.optionRow}>
                            <Text style={styles.optionName}>• {opt.option_service_id.name}</Text>
                            <Text style={styles.optionPrice}>{formatPrice(opt.option_service_id.price_extra)}</Text>
                        </View>
                    ))}
                </View>
            )}
            {/* Button hành động ở cuối màn hình */}
            {bk.status === 'pending' && (
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: COLORS.grey }]}
                        onPress={() => {
                            Alert.alert(
                                'Xác nhận hủy đơn',
                                'Bạn có chắc chắn muốn hủy đơn này không?',
                                [
                                    { text: 'Không', style: 'cancel' },
                                    {
                                        text: 'Có',
                                        style: 'destructive',
                                        onPress: async () => {
                                            try {
                                                await cancelBookingById(bk._id);
                                                Alert.alert('Đã hủy đơn', 'Đơn hàng của bạn đã được hủy.');

                                                // 🟢 Gọi lại API chi tiết để cập nhật đầy đủ thông tin
                                                const updatedBooking = await getBookingDetailById(bk._id);
                                                setBooking(updatedBooking);
                                            } catch (err) {
                                                console.error('❌ Hủy đơn thất bại:', err);
                                                Alert.alert('Lỗi', err?.response?.data?.message || 'Không thể hủy đơn hàng.');
                                            }
                                        }
                                    },
                                ],
                                { cancelable: true }
                            );
                        }}
                    >
                        <Text style={styles.actionText}>Hủy đơn</Text>
                    </TouchableOpacity>
                </View>
            )}

            {bk.status === 'canceled' && (
                <View style={[styles.buttonRow, { justifyContent: 'center' }]}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
                        onPress={() => {
                            if (bk?.tour_id?._id) {
                                router.push(`/trip-detail/${bk.tour_id._id}`);
                            } else {
                                Alert.alert('Lỗi', 'Không tìm thấy tour để đặt lại.');
                            }
                            // router.push(`/trip-detail/${bk.tour_id._id}`);
                        }}
                    >
                        <Text style={styles.actionText}>Đặt lại tour</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primaryDark,
        textAlign: 'center',
    },
    // imageBackground: { height: 150, justifyContent: 'flex-end' },
    // imageStyle: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
    imageOverlay: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 7,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    statusBadge: {
        alignSelf: 'flex-start',
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
    card: {
        backgroundColor: COLORS.white,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: COLORS.primary,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: COLORS.primaryDark,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: COLORS.grey,
    },
    value: {
        fontWeight: 'bold',
        color: COLORS.primaryDark,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    optionName: {
        fontSize: 14,
        color: COLORS.primaryDark,
    },
    optionPrice: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    errorText: {
        marginTop: 50,
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
    },
    imageWrapper: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageBackground: {
        height: 150,
        justifyContent: 'flex-end',
    },
    imageStyle: {
        borderRadius: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginVertical: 20,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

});
