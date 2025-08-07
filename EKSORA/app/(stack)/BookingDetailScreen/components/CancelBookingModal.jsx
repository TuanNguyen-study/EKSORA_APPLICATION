import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../../../../constants/colors'; 

const CancelBookingModal = ({ isVisible, onClose, onConfirm, isCancelling }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose} // Cho phép nút back trên Android đóng modal
        >
            <TouchableOpacity
                style={styles.centeredView}
                activeOpacity={1}
                onPressOut={onClose} // Chạm ra ngoài để đóng
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Xác nhận hủy đơn</Text>
                    <Text style={styles.modalText}>
                        Bạn có chắc chắn muốn hủy vĩnh viễn đơn hàng này không?
                    </Text>

                    <View style={styles.buttonRow}>
                        {/* Nút "Không" */}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={onClose}
                            disabled={isCancelling}
                        >
                            <Text style={[styles.textStyle, styles.textClose]}>Không</Text>
                        </TouchableOpacity>

                        {/* Nút "Có" */}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={onConfirm}
                            disabled={isCancelling}
                        >
                            {isCancelling ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.textStyle}>Có, Hủy Đơn</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
    },
    modalTitle: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primaryDark || '#333',
    },
    modalText: {
        marginBottom: 25,
        textAlign: 'center',
        fontSize: 16,
        color: COLORS.grey || '#555',
        lineHeight: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonClose: {
        backgroundColor: COLORS.lightGrey || '#E0E0E0',
    },
    buttonConfirm: {
        backgroundColor: COLORS.danger || '#E74C3C',
    },
    textStyle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    textClose: {
        color: COLORS.darkText || '#333', 
    },
});

export default CancelBookingModal;