import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TourReviewCard from './TourReviewCard';
import { getUserBookings, postReview } from '../../../API/services/servicesUser';

const ReviewScreen = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Lấy userId từ AsyncStorage và gọi API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("ACCESS_TOKEN");
                const userId = await AsyncStorage.getItem("USER_ID");

                if (!userId || !token) {
                    setError('Không tìm thấy người dùng hoặc token');
                    return;
                }

                const data = await getUserBookings(userId, token);

                // Danh sách các booking đã review (theo booking._id)
                const reviewed = await AsyncStorage.getItem("REVIEWED_BOOKINGS");
                const reviewedBookings = reviewed ? JSON.parse(reviewed) : [];

                // Lọc bỏ các booking đã review
                const filteredData = data.filter(
                    (item) => !reviewedBookings.includes(item._id)
                );

                setBookings(filteredData);

            } catch (err) {
                setError('Lỗi khi tải danh sách đơn hàng');
                console.error('Lỗi API:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);



    const handleSubmitReview = async (bookingId, tourId, rating, comment) => {
        try {
            const userId = await AsyncStorage.getItem("USER_ID");
            if (!userId) throw new Error('Không tìm thấy USER_ID');

            await postReview(userId, tourId, rating, comment);

            // Đánh dấu đã review booking này
            const stored = await AsyncStorage.getItem('REVIEWED_BOOKINGS');
            let reviewedBookings = stored ? JSON.parse(stored) : [];
            reviewedBookings.push(bookingId);
            await AsyncStorage.setItem('REVIEWED_BOOKINGS', JSON.stringify(reviewedBookings));

            // Cập nhật lại UI
            setBookings((prev) => prev.filter((item) => item._id !== bookingId));

        } catch (err) {
            console.error('Lỗi gửi đánh giá:', err);
            Alert.alert('Lỗi', 'Không thể gửi đánh giá. Vui lòng thử lại.');
        }
    };



    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Đánh giá chuyến đi</Text>
                    <Text style={styles.headerSubtitle}>
                        Chia sẻ cảm nhận để nhận những ưu đãi hấp dẫn nhé!
                    </Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                </View>
            ) : bookings.length === 0 ? (
                <View style={styles.centered}>
                    <Text>Bạn chưa có chuyến đi nào để đánh giá</Text>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={({ item }) => (
                        <TourReviewCard
                            tourBooking={item}
                            onSubmitReview={(rating, comment) =>
                                handleSubmitReview(item._id, item.tour_id._id, rating, comment)
                            }
                        />

                    )}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        paddingRight: 10,
        paddingVertical: 10,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    listContainer: {
        paddingBottom: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReviewScreen;
