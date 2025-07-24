import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TourReviewCard from './TourReviewCard';
import * as ImageManipulator from 'expo-image-manipulator';
import { getUserBookings, postReview } from '../../../API/services/servicesUser';

const ReviewScreen = () => {
    const navigation = useNavigation();

    // --- STATE MANAGEMENT  ---
    const [bookings, setBookings] = useState([]);
    const [screenLoading, setScreenLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);
    const [error, setError] = useState('');

    // --- FETCH DANH SÁCH BOOKING  ---
    useEffect(() => {
    const fetchBookings = async () => {
        try {
            setScreenLoading(true);
            const token = await AsyncStorage.getItem("ACCESS_TOKEN");
            const userId = await AsyncStorage.getItem("USER_ID");

            if (!userId || !token) {
                setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
                return; 
            }

            const data = await getUserBookings(userId, token);
            //console.log('Dữ liệu từ API:', data);

            // Lọc ra các booking chưa được đánh giá
            const reviewedJSON = await AsyncStorage.getItem("REVIEWED_BOOKINGS");
            const reviewedIds = reviewedJSON ? JSON.parse(reviewedJSON) : [];
            let filteredData = data.filter(item => !reviewedIds.includes(item._id));

            // Sắp xếp theo created_at giảm dần (gần đây nhất lên đầu)
            if (filteredData.length > 0) {
                filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
                //console.log('Dữ liệu sau khi sắp xếp:', filteredData); // Kiểm tra kết quả
            } else {
                console.log('Không có dữ liệu để sắp xếp');
            }

            setBookings(filteredData);
        } catch (err) {
            setError('Lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.');
            console.error('Lỗi chi tiết tại fetchBookings:', err);
        } finally {
            setScreenLoading(false);
        }
    };

    fetchBookings();
}, []);

    // ---  HÀM GỬI ĐÁNH GIÁ ---
    const handleSubmitReview = async (bookingId, tourData, rating, comment, localImageUris) => {
        setSubmittingId(bookingId); 

        try {
            // 1. LẤY THÔNG TIN CẦN THIẾT
            const userId = await AsyncStorage.getItem("USER_ID");
            const token = await AsyncStorage.getItem("ACCESS_TOKEN");

            // 2. XỬ LÝ TOUR ID AN TOÀN 
            const tourId = (typeof tourData === 'object' && tourData !== null) ? tourData._id : tourData;

            // 3. VALIDATE DỮ LIỆU CƠ BẢN
            if (!userId || !token || !tourId || !rating || rating === 0) {
                Alert.alert('Thiếu thông tin', 'Vui lòng chọn số sao để đánh giá.');
                setSubmittingId(null);
                return;
            }

            // 4.  XỬ LÝ ẢNH: NÉN VÀ CHUYỂN SANG BASE64
            let imagesPayload = []; // Mảng sẽ được gửi lên API
            if (Array.isArray(localImageUris) && localImageUris.length > 0) {
                // Sử dụng Promise.all để xử lý tất cả ảnh một cách đồng thời
                imagesPayload = await Promise.all(
                    localImageUris.map(async (uri) => {
                        const manipResult = await ImageManipulator.manipulateAsync(
                            uri,
                            [{ resize: { width: 800 } }],
                            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
                        );
                        return manipResult.base64;
                    })
                );
            }

            // --- Log cuối cùng để kiểm tra ---
            if (imagesPayload.length > 0) {
                console.log(`-   (Ảnh đầu tiên bắt đầu bằng: ${imagesPayload[0].substring(0, 10)}...)`);
            }

            // 5. GỌI API ĐỂ GỬI ĐÁNH GIÁ
            await postReview(userId, tourId, rating, comment, imagesPayload, token);

            // 6. XỬ LÝ SAU KHI THÀNH CÔNG
            const stored = await AsyncStorage.getItem('REVIEWED_BOOKINGS');
            const reviewedBookings = stored ? JSON.parse(stored) : [];
            reviewedBookings.push(bookingId);
            await AsyncStorage.setItem('REVIEWED_BOOKINGS', JSON.stringify(reviewedBookings));

            Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá chuyến đi!');
            // Cập nhật lại UI để xóa card vừa đánh giá
            setBookings(prev => prev.filter(item => item._id !== bookingId));

        } catch (err) {
            // 7. XỬ LÝ LỖI 
            console.error("--- LỖI CHI TIẾT KHI GỬI ĐÁNH GIÁ ---", err);
            const errorMessage = err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau.';
            Alert.alert('Đã xảy ra lỗi', errorMessage);
        } finally {
            // 8. LUÔN TẮT LOADING KHI KẾT THÚC
            setSubmittingId(null);
        }
    };

    // --- RENDER FUNCTIONS  ---
    const renderContent = () => {
        if (screenLoading) {
            return <View style={styles.centered}><ActivityIndicator size="large" color="#000" /></View>;
        }
        if (error) {
            return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
        }
        if (bookings.length === 0) {
            return <View style={styles.centered}><Text>Bạn không có chuyến đi nào cần đánh giá.</Text></View>;
        }
        return (
            <FlatList
                data={bookings}
                renderItem={({ item }) => (
                    <TourReviewCard
                        tourBooking={item}
                        isSubmitting={submittingId === item._id}
                        onSubmitReview={(rating, comment, images) =>
                            handleSubmitReview(item._id, item.tour_id, rating, comment, images)
                        }
                    />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Đánh giá chuyến đi</Text>
                    <Text style={styles.headerSubtitle}>Chia sẻ cảm nhận để nhận ưu đãi nhé!</Text>
                </View>
            </View>
            {renderContent()}
        </SafeAreaView>
    );
};

// --- STYLES  ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    backButton: { padding: 5 },
    headerTextContainer: { flex: 1, marginLeft: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111' },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
    listContainer: { paddingVertical: 10, paddingHorizontal: 15 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: 'red', textAlign: 'center' },
});

export default ReviewScreen;