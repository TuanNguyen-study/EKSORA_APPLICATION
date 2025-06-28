import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const TourReviewCard = ({ tourBooking, onSubmitReview }) => {
    const { tour_id: tour } = tourBooking;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmitReview = () => {
        if (rating === 0) {
            Alert.alert('Chưa hoàn tất', 'Vui lòng chọn số sao để đánh giá.');
            return;
        }
        if (comment.trim() === '') {
            Alert.alert('Chưa hoàn tất', 'Bạn hãy viết một vài cảm nhận về chuyến đi nhé.');
            return;
        }

        if (onSubmitReview) {
            onSubmitReview(rating, comment);
            Alert.alert(
                'Cảm ơn bạn!',
                'Đánh giá của bạn đã được ghi nhận. Chúc bạn có thêm nhiều chuyến đi tuyệt vời!',
            );
            setRating(0);
            setComment('');
        }
    };

    const StarRating = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Icon
                            name={rating >= star ? 'star' : 'star-outline'}
                            size={35}
                            color={rating >= star ? '#FFD700' : '#d1d1d1'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Image source={{ uri: tour.image[0] }} style={styles.tourImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.tourName}>{tour.name}</Text>

                <View style={styles.detailRow}>
                    <Icon name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{tour.location}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{tour.duration}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon name="cash-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        Chi phí: {formatCurrency(tourBooking.totalPrice)}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.reviewSection}>
                <Text style={styles.reviewTitle}>Cảm nhận của bạn về chuyến đi?</Text>
                <StarRating />
                <TextInput
                    style={styles.textInput}
                    placeholder="Hãy chia sẻ những trải nghiệm của bạn về chuyến đi này nhé..."
                    multiline
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                    <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
// StyleSheet để tạo style cho giao diện
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden', // Đảm bảo bo góc cho ảnh
    },
    tourImage: {
        width: '100%',
        height: 180,
    },
    infoContainer: {
        padding: 15,
    },
    tourName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 15,
    },
    reviewSection: {
        padding: 15,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 30,
    },
    textInput: {
        height: 120,
        borderWidth: 1,
        borderColor: '#d1d1d1',
        borderRadius: 8,
        padding: 15,
        textAlignVertical: 'top', // Căn text lên trên cùng cho Android
        fontSize: 15,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    tourImage: {
        width: '100%',
        height: 180,
    },
    infoContainer: {
        padding: 15,
    },
    tourName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 15,
    },
    reviewSection: {
        padding: 15,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 30,
    },
    textInput: {
        height: 120,
        borderWidth: 1,
        borderColor: '#d1d1d1',
        borderRadius: 8,
        padding: 15,
        textAlignVertical: 'top',
        fontSize: 15,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});



export default TourReviewCard;