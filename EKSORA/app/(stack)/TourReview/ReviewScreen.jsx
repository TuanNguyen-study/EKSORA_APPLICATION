import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import TourReviewCard from './TourReviewCard';
import * as ImageManipulator from 'expo-image-manipulator';
import { getUserBookings, postReview } from '../../../API/services/servicesUser';

const ReviewScreen = () => {

    const navigation = useNavigation();

    const [bookings, setBookings] = useState([]);
    const [screenLoading, setScreenLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);
    const [error, setError] = useState('');

    // Hàm lấy key lưu review theo userId
    const getReviewKey = (userId) => `REVIEWED_BOOKINGS_${userId}`;

    // --- FETCH DANH SÁCH BOOKING ---
    useFocusEffect(
        React.useCallback(() => {
            const fetchBookings = async () => {
                try {
                    setScreenLoading(true);
                    setError('');

                    const token = await AsyncStorage.getItem("ACCESS_TOKEN");
                    const userId = await AsyncStorage.getItem("USER_ID");

                    if (!userId || !token) {
                        setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
                        setScreenLoading(false);
                        return;
                    }

                    const data = await getUserBookings(userId, token);

                    // Lấy danh sách booking đã review theo userId
                    const reviewedJSON = await AsyncStorage.getItem(getReviewKey(userId));
                    const reviewedIds = reviewedJSON ? JSON.parse(reviewedJSON) : [];

                    const allowedStatuses = ['paid', 'completed'];
                    const bookingsToReview = data.filter(item =>
                        allowedStatuses.includes(item.status?.toLowerCase().trim()) &&
                        !reviewedIds.includes(item._id)
                    );

                    bookingsToReview.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    setBookings(bookingsToReview);

                } catch (err) {
                    setError('Lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.');
                    console.error('Lỗi chi tiết tại fetchBookings:', err);
                } finally {
                    setScreenLoading(false);
                }
            };

            fetchBookings();
        }, [])
    );

    // ---  HÀM GỬI ĐÁNH GIÁ ---
    const handleSubmitReview = async (bookingId, tourData, rating, comment, localImageUris = []) => {
        setSubmittingId(bookingId);
        try {
            const userId = await AsyncStorage.getItem("USER_ID");
            const token = await AsyncStorage.getItem("ACCESS_TOKEN");
            const tourId = (tourData && typeof tourData === 'object') ? tourData._id : tourData;

            if (!userId || !token || !tourId || !rating) {
                Toast.show({ type: 'error', text1: 'Thiếu thông tin', text2: 'Vui lòng chọn số sao.' });
                setSubmittingId(null);
                return;
            }

            // 1) GIỚI HẠN SỐ ẢNH & NÉN MẠNH HƠN
            const maxImages = 3;
            const uris = (Array.isArray(localImageUris) ? localImageUris.slice(0, maxImages) : []);

            // 2) XỬ LÝ THEO LƯỢT (CONCURRENCY = 2)
            const concurrency = 2;
            let imagesPayload = [];
            for (let i = 0; i < uris.length; i += concurrency) {
                const batch = uris.slice(i, i + concurrency);
                const results = await Promise.all(
                    batch.map(async (uri) => {
                        const m = await ImageManipulator.manipulateAsync(
                            uri,
                            [{ resize: { width: 600 } }],
                            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
                        );
                        return m.base64;
                    })
                );
                imagesPayload = imagesPayload.concat(results);
            }

            // 3) CẢNH BÁO KHI PAYLOAD QUÁ LỚN (ước lượng size ~ (base64Len * 3/4) bytes)
            const approxBytes = imagesPayload.reduce((sum, b64) => sum + Math.floor(b64.length * 0.75), 0);
            const approxMB = (approxBytes / (1024 * 1024)).toFixed(2);
            if (approxBytes > 8 * 1024 * 1024) {
                Toast.show({ type: 'info', text1: 'Ảnh lớn', text2: `Tổng ~${approxMB}MB, đang gửi...` });
            }

            await postReview(userId, tourId, rating, comment, imagesPayload, token);

            const key = `REVIEWED_BOOKINGS_${userId}`;
            const stored = await AsyncStorage.getItem(key);
            const reviewed = stored ? JSON.parse(stored) : [];
            await AsyncStorage.setItem(key, JSON.stringify([...reviewed, bookingId]));

            Toast.show({ type: 'success', text1: 'Thành công', text2: 'Cảm ơn bạn đã đánh giá!' });
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (err) {
            console.error('SUBMIT REVIEW ERROR', err);
            const msg = err?.response?.data?.message || 'Không thể gửi đánh giá. Thử lại sau.';
            Toast.show({ type: 'error', text1: 'Lỗi', text2: msg });
        } finally {
            setSubmittingId(null);
        }
    };


    const renderContent = () => {
        if (screenLoading) {
            return <View style={styles.centered}><ActivityIndicator size="large" color="#000" /></View>;
        }
        if (error) {
            return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
        }
        if (bookings.length === 0) {
            return <View style={styles.centered}><Text style={styles.emptyText}>Bạn không có chuyến đi nào cần đánh giá.</Text></View>;
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
    emptyText: { fontSize: 16, color: '#666', textAlign: 'center' }
});

export default ReviewScreen;