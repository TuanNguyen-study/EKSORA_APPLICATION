import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    Modal,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


const cardShadow = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    android: {
        elevation: 3,
    },
});

export default function Body() {

    const [showModal, setShowModal] = useState(false);
    const [ho, setHo] = useState('');
    const [ten, setTen] = useState('');
    const [sdt, setSdt] = useState('');
    const [email, setEmail] = useState('');
    return (
        <>
            <Modal
                visible={showModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thêm thông tin liên lạc</Text>

                        <TextInput
                            placeholder="Họ"
                            value={ho}
                            onChangeText={setHo}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Tên"
                            value={ten}
                            onChangeText={setTen}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Số điện thoại"
                            value={sdt}
                            onChangeText={setSdt}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                        />

                        <Text style={styles.noteText}>
                            Thông tin này sẽ được sử dụng để liên hệ và gửi mã vé cho bạn.
                        </Text>

                        <Pressable style={styles.saveButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.saveButtonText}>Lưu</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>



            {/* Tour Info Card */}
            <View style={styles.card}>
                <Text style={styles.tourTitle}>
                    Tour Tham Quan Ninh Bình Trong Ngày, Khởi Hành Từ Thành Phố Hồ Chí Minh
                </Text>
                <Text style={styles.grayText}>Vé tiêu chuẩn</Text>
                <Text style={styles.grayText}>16/5/2025</Text>
                <Text style={styles.grayText}>Người lớn x1</Text>
                <Text style={styles.tourPrice}>₫ 747,000</Text>
            </View>

            {/* Contact Info Card */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <Ionicons name="information-circle-outline" size={18} color="#2196F3" />
                    <Text style={styles.cardTitle}>Thông tin liên lạc:</Text>
                </View>
                <Text style={styles.subText}>
                    Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn
                </Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
                    <Text style={styles.addBtnText}>+ Thêm</Text>
                </TouchableOpacity>

                <View style={styles.infoList}>
                    <Text style={styles.infoItem}>Họ <Text style={styles.link}>Nhập</Text></Text>
                    <Text style={styles.infoItem}>Tên <Text style={styles.link}>Nhập</Text></Text>
                    <Text style={styles.infoItem}>Số điện thoại <Text style={styles.link}>Nhập</Text></Text>
                    <View style={styles.rowBetween}>
                        <Text style={styles.infoItem}>Địa chỉ email <Text style={styles.link}>Nhập</Text></Text>
                        <TouchableOpacity style={styles.link1}>Chỉnh sửa</TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Discount Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Giảm giá</Text>
                <View style={styles.rowBetween}>
                    <Text style={styles.grayText}>Mã ưu đãi nền tảng</Text>
                    <Text style={styles.grayText}>Không khả dụng</Text>
                </View>
                <View style={styles.rowBetween}>
                    <Text style={styles.grayText}>Mã ưu đãi thanh toán</Text>
                    <Text style={styles.grayText}>Không khả dụng</Text>
                </View>
            </View>

            {/* Terms and Notice */}
            <Text style={styles.termsText}>
                Tôi đã hiểu và đồng ý với <Text style={styles.underline}>Điều Khoản Sử Dụng Chung</Text> và <Text style={styles.underline}>Chính Sách Quyền riêng tư của ESROSA</Text>
            </Text>

            <View style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                    Xin điền thông tin cần thiết. Thông tin đã gởi sẽ không thể thay đổi.
                </Text>
            </View>

            {/* Payment */}
            <View style={styles.card}>
                <View style={styles.rowBetween}>
                    <Text style={styles.totalText}>₫ 747,000</Text>
                    <Text style={styles.discountText}>Giảm 64,000₫</Text>
                </View>
                <TouchableOpacity style={styles.payBtn} onPress={() => router.push('/(stack)/PaymentMenthod')}>
                    <Text style={styles.payBtnText}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({

    addBtn: {
        backgroundColor: '#D6EAF8',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },

    addBtnText: {
        color: '#0057A5', // xanh dương đậm hơn
        fontWeight: '700',
        fontSize: 14,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        marginTop: 10,
        ...cardShadow,
    },
    cardTitle: {
        color: '#2196F3',
        fontWeight: '600',
        marginLeft: 6,
        marginBottom: 8,
    },
    tourTitle: {
        fontWeight: '600',
        marginBottom: 6,
    },
    grayText: {
        color: '#666',
        marginBottom: 2,
    },
    tourPrice: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
        marginTop: 10,
    },
    subText: {
        color: '#777',
        fontSize: 13,
        marginBottom: 8,
    },
    link: {
        color: '#0057A5',
        fontWeight: '600',
    },

    link1: {
        color: '#000',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    infoList: {
        marginTop: 8,
        gap: 6,
    },
    infoItem: {
        color: '#333',
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    termsText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    underline: {
        textDecorationLine: 'underline',
    },
    noticeBox: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    noticeText: {
        color: '#1976d2',
        fontSize: 13,
    },
    totalText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    discountText: {
        color: 'green',
        fontWeight: '600',
    },
    payBtn: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 50,
        marginTop: 16,
    },
    payBtnText: {
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
    },
      modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
