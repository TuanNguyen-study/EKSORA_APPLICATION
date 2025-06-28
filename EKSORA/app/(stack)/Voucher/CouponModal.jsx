import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { COLORS } from '../../../constants/colors';
import { getPromotion } from '../../../API/services/servicesPromotion';

const CouponTicket = React.memo(({
    mainTitle,
    expiryText,
    discountAmount,
    detailsText,
    status,
    onToggleStatus,
}) => {
    return (
        <View style={styles.ticketContainer}>
            <View style={styles.ticketMainSection}>
                <Text style={styles.ticketMainTitle}>{mainTitle}</Text>
                {expiryText && <Text style={styles.ticketExpiry}>{expiryText}</Text>}
            </View>

            <View style={styles.ticketSeparatorContainer}>
                <View style={styles.ticketCutoutTop} />
                <View style={styles.ticketSeparator} />
                <View style={styles.ticketCutoutBottom} />
            </View>

            <View style={styles.ticketDiscountSection}>
                <Text style={styles.ticketDiscountAmount}>{discountAmount}</Text>
                {detailsText && <Text style={styles.ticketDetails}>{detailsText}</Text>}
                <TouchableOpacity
                    style={[
                        styles.ticketStatusButton,
                        status === 'saved' && styles.ticketStatusButtonSaved,
                    ]}
                    onPress={onToggleStatus}
                >
                    <Text
                        style={[
                            styles.ticketStatusButtonText,
                            status === 'saved' && styles.ticketStatusButtonTextSaved,
                        ]}
                    >
                        {status === 'saved' ? 'Đã lưu' : 'Lưu'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const CouponModal = ({ visible, onClose }) => {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchPromotions();
        }
    }, [visible]);

    const fetchPromotions = async () => {
        try {
            const response = await getPromotion();
            if (!Array.isArray(response)) {
                console.warn('Dữ liệu khuyến mãi trả về không phải dạng mảng:', response);
                return;
            }

            const mappedCoupons = response.map((item) => ({
                id: item._id,
                mainTitle: item.condition || `Ưu đãi từ mã ${item.code}`,
                expiryText: item.end_date
                    ? `Hết hạn: ${formatDate(item.end_date)}`
                    : null,
                discountAmount: `Giảm ${item.discount}%`,
                detailsText: `Mã: ${item.code}`,
                status: 'available',
            }));
            setCoupons(mappedCoupons);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách mã khuyến mãi:', error);
        }
    };


    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${day}/${month} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    const toggleStatus = (id) => {
        setCoupons((prev) =>
            prev.map((coupon) =>
                coupon.id === id
                    ? {
                        ...coupon,
                        status: coupon.status === 'saved' ? 'available' : 'saved',
                    }
                    : coupon
            )
        );
    };

    const renderCoupon = ({ item }) => (
        <CouponTicket
            mainTitle={item.mainTitle}
            expiryText={item.expiryText}
            discountAmount={item.discountAmount}
            detailsText={item.detailsText}
            status={item.status}
            onToggleStatus={() => toggleStatus(item.id)}
        />
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Quà tặng bạn mới</Text>
                        <Text style={styles.headerSubtitle}>Giảm đến 10%</Text>
                    </View>

                    <FlatList
                        data={coupons}
                        renderItem={renderCoupon}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Hiện chưa có mã ưu đãi.</Text>}
                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        windowSize={10}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Xem ưu đãi trong Tài khoản của bạn</Text>
                        <View style={styles.termsContainer}>
                            <Text style={styles.footerText}>Điều khoản & Điều kiện </Text>
                            <View style={styles.infoIcon}>
                                <Text style={styles.infoIconText}>i</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.modalOverlay,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.primaryBlue,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '55%',
        overflow: 'hidden',
    },
    header: {
        paddingVertical: 20,
        paddingBottom: 40,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        left: 20,
    },
    closeButtonText: {
        fontSize: 24,
        color: COLORS.black,
        fontWeight: '300',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: 16,
        color: COLORS.white,
        marginTop: 4,
    },
    content: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        padding: 20,
        backgroundColor: COLORS.white,
    },
    ticketContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightBlue,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        height: 120,
    },
    ticketMainSection: {
        flex: 2.5,
        padding: 15,
        justifyContent: 'center',
    },
    ticketDiscountSection: {
        flex: 1.5,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: 'transparent',
    },
    ticketMainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    ticketExpiry: {
        fontSize: 14,
        color: COLORS.primaryBlue,
        marginTop: 8,
    },
    ticketDiscountAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primaryBlue,
        textAlign: 'center',
    },
    ticketDetails: {
        fontSize: 12,
        color: COLORS.grayText,
        textAlign: 'center',
        marginTop: 4,
    },
    ticketStatusButton: {
        backgroundColor: COLORS.secondaryBlue,
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginTop: 8,
        alignItems: 'center',
    },
    ticketStatusButtonSaved: {
        backgroundColor: COLORS.primaryBlue,
    },
    ticketStatusButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    ticketStatusButtonTextSaved: {
        color: COLORS.white,
    },
    ticketSeparatorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ticketSeparator: {
        height: '60%',
        width: 1,
        borderLeftWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.borderColor,
    },
    ticketCutoutTop: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        position: 'absolute',
        top: -10,
        left: -10,
    },
    ticketCutoutBottom: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        position: 'absolute',
        bottom: -10,
        left: -10,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: COLORS.white,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.grayText,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    infoIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.grayText,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    infoIconText: {
        fontSize: 10,
        color: COLORS.grayText,
        fontWeight: 'bold',
    },
});

export default CouponModal;