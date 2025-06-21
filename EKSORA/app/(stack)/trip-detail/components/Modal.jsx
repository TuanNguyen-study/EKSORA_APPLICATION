import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { router } from 'expo-router';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const BookingModalContent = ({ visible, onClose, priceInfo, tourName }) => {
    const [selectedDate, setSelectedDate] = React.useState('16/5');

    const formatPrice = (price) => {
        if (typeof price !== 'number') return 'N/A';
        return price.toLocaleString('vi-VN');
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Tùy chọn đơn hàng</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content}>
                        <View style={styles.tourInfo}>
                            <Text style={styles.tourName}>
                                {tourName}
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.detailsLink}>Chi tiết</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Xin chọn ngày tham gia</Text>
                            <View style={styles.dateRow}>
                                <Text style={styles.dateRange}>Xem trạng thái dịch vụ</Text>
                                <Text style={styles.dateRange}>16/5 - 31/12</Text>
                            </View>
                            <View style={styles.dateOptions}>
                                {['16/5', '17/5', '18/5', '19/5'].map((date) => (
                                    <TouchableOpacity
                                        key={date}
                                        style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
                                        onPress={() => setSelectedDate(date)}
                                    >
                                        <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>{date}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footerWrapper}>
                        <View style={styles.footer}>
                            <Text style={styles.priceText}>
                                {priceInfo?.currency || 'đ'} {formatPrice(priceInfo?.current)}
                            </Text>
                            <View style={styles.pointTag}><Text style={styles.pointTagText}>EKSORA Xu +128</Text></View>
                        </View>
                        <TouchableOpacity
                            style={styles.bookNowBtn}
                            onPress={() => {
                                onClose(); // Đóng modal trước
                                setTimeout(() => {
                                    router.push('/(stack)/Payment'); // Điều hướng sau khi đóng
                                }, 100); // Delay nhẹ để tránh lỗi UI
                            }}
                        >
                            <Text style={styles.bookNowText}>Đặt ngay</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BookingModalContent;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        height: SCREEN_HEIGHT * 0.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    tourInfo: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tourName: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    detailsLink: {
        color: COLORS?.primary || '#007AFF',
        fontWeight: '600',
    },
    section: {
        marginTop: 20,
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateRange: {
        color: '#666',
        fontSize: 12,
    },
    dateOptions: {
        flexDirection: 'row',
        marginTop: 12,
        flexWrap: 'wrap',
        gap: 8,
    },
    dateButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    selectedDateButton: {
        backgroundColor: COLORS?.primary || '#007AFF',
    },
    dateText: {
        fontWeight: '500',
    },
    selectedDateText: {
        color: '#fff',
    },
    footerWrapper: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text || '#000',
    },
    pointTag: {
        backgroundColor: '#E6F9ED',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pointTagText: {
        fontSize: 12,
        color: '#2FAE66',
        fontWeight: '600'
    },
    bookNowBtn: {
        backgroundColor: COLORS?.primary || '#007AFF',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    bookNowText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
