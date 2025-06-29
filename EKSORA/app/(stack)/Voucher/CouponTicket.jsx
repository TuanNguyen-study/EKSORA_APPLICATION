import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

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
                <Pressable
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
                </Pressable>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
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
});

export default CouponTicket;
