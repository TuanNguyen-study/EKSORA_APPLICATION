import { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

// --- CÁC HÀM TIỆN ÍCH ---
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Lỗi định dạng ngày:", isoString, error);
        return 'Ngày không hợp lệ';
    }
};

// --- COMPONENT CHÍNH ---
const TourReviewCard = ({ tourBooking, onSubmitReview, isSubmitting }) => {
    const { tour_id: tour, totalPrice, travel_date } = tourBooking;
    
    // --- STATE ---
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);

    // --- KIỂM TRA DỮ LIỆU ĐẦU VÀO ---
    // Nếu tour không tồn tại hoặc không phải object, hiển thị lỗi để tránh crash
    if (!tour || typeof tour !== 'object') {
        return (
            <View style={styles.card}>
                <Text style={styles.errorText}>Lỗi: Dữ liệu tour không hợp lệ.</Text>
            </View>
        );
    }
    
    // --- CÁC HÀM XỬ LÝ ---
    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần cấp quyền', 'Vui lòng cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const selectedUris = result.assets.map(asset => asset.uri);
            setImages(prevImages => [...prevImages, ...selectedUris]);
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert('Chưa hoàn tất', 'Vui lòng chọn số sao để đánh giá.');
            return;
        }
        if (comment.trim() === '') {
            Alert.alert('Chưa hoàn tất', 'Bạn hãy viết một vài cảm nhận về chuyến đi nhé.');
            return;
        }

        if (onSubmitReview) {
            onSubmitReview(rating, comment, images);
        }
    };

    // --- SUB-COMPONENTS (RENDER) ---
    const StarRating = () => (
        <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} disabled={isSubmitting}>
                    <Icon
                        name={rating >= star ? 'star' : 'star-outline'}
                        size={35}
                        color={rating >= star ? '#FFD700' : '#d1d1d1'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.card}>
            {/* Kiểm tra tour.image tồn tại trước khi render */}
            {tour.image && tour.image.length > 0 && (
                <Image source={{ uri: tour.image[0] }} style={styles.tourImage} />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.tourName}>{tour.name || 'Tên tour không xác định'}</Text>

                <View style={styles.detailRow}>
                    <Icon name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{tour.location || 'Địa điểm không xác định'}</Text>
                </View>

                {travel_date && tour.opening_time && (
                    <View style={styles.detailRow}>
                        <Icon name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            Khởi hành: {tour.opening_time} - {formatDate(travel_date)}
                        </Text>
                    </View>
                )}

                <View style={styles.detailRow}>
                    <Icon name="cash-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        Chi phí: {formatCurrency(totalPrice)}
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
                    placeholderTextColor="#777"
                    multiline
                    value={comment}
                    onChangeText={setComment}
                    editable={!isSubmitting} // Không cho sửa khi đang gửi
                />
                
                <View style={styles.imagePickerSection}>
                    <TouchableOpacity style={styles.imagePickerButton} onPress={handleChoosePhoto} disabled={isSubmitting}>
                        <Icon name="camera-outline" size={22} color="#007BFF" />
                        <Text style={styles.imagePickerButtonText}>Thêm hình ảnh</Text>
                    </TouchableOpacity>
                    
                    {images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewContainer}>
                            {images.map((uri, index) => (
                                <View key={index} style={styles.previewImageWrapper}>
                                    <Image source={{ uri }} style={styles.previewImage} />
                                    <TouchableOpacity 
                                        style={styles.removeImageButton} 
                                        onPress={() => handleRemoveImage(index)}
                                        disabled={isSubmitting}
                                    >
                                        <Icon name="close-circle" size={24} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Vô hiệu hóa nút và đổi style khi đang gửi */}
                <TouchableOpacity 
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 10,
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
        color: 'black',
    },
    imagePickerSection: {
        marginBottom: 20,
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007BFF',
        borderStyle: 'dashed',
        backgroundColor: '#f0f8ff',
    },
    imagePickerButtonText: {
        marginLeft: 8,
        color: '#007BFF',
        fontSize: 16,
        fontWeight: '600',
    },
    previewContainer: {
        marginTop: 15,
        flexDirection: 'row',
    },
    previewImageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#a9d6ff', 
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        padding: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default TourReviewCard;