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
    const handleSubmitReview = async (bookingId, tourData, rating, comment, localImageUris) => {
        setSubmittingId(bookingId);

        try {
            const userId = await AsyncStorage.getItem("USER_ID");
            const token = await AsyncStorage.getItem("ACCESS_TOKEN");
            const tourId = (typeof tourData === 'object' && tourData !== null) ? tourData._id : tourData;

            if (!userId || !token || !tourId || !rating || rating === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Thiếu thông tin',
                    text2: 'Vui lòng chọn số sao để đánh giá.'
                });
                setSubmittingId(null);
                return;
            }

            let imagesPayload = [];
            if (Array.isArray(localImageUris) && localImageUris.length > 0) {
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

            await postReview(userId, tourId, rating, comment, imagesPayload, token);

            // Lưu booking đã review kèm userId
            const key = getReviewKey(userId);
            const stored = await AsyncStorage.getItem(key);
            const reviewedBookings = stored ? JSON.parse(stored) : [];
            reviewedBookings.push(bookingId);
            await AsyncStorage.setItem(key, JSON.stringify(reviewedBookings));

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Cảm ơn bạn đã đánh giá chuyến đi!'
            });
            setBookings(prev => prev.filter(item => item._id !== bookingId));

        } catch (err) {
            console.error("--- LỖI CHI TIẾT KHI GỬI ĐÁNH GIÁ ---", err);
            const errorMessage = err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau.';
            Toast.show({
                type: 'error',
                text1: 'Đã xảy ra lỗi',
                text2: errorMessage
            });
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