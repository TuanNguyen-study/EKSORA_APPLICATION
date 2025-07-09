import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import VoucherItem from './VoucherItem';
import { getVouchersByUserId } from '../../../../API/services/servicesPromotion';

const VoucherModal = ({ visible, onClose, onApplyVoucher, selectedVoucher }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchAndFilterVouchers = async () => {
        setLoading(true);
        setError(null);

        try {
          const userId = await AsyncStorage.getItem("USER_ID");
          if (!userId) {
            setError('Không tìm thấy thông tin người dùng.');
            setLoading(false);
            return;
          }

          const userVouchers = await getVouchersByUserId(userId);
          if (!Array.isArray(userVouchers)) {
            throw new Error('Dữ liệu trả về từ API không phải mảng');
          }

          const now = new Date();
          const validVouchers = userVouchers
            .filter((item) => item.voucher_id)
            .filter((item) => new Date(item.voucher_id.end_date) > now);

          const demoData = validVouchers.map((v) => ({
            ...v,
            voucher_id: {
              ...v.voucher_id,
              min_order_value: v.voucher_id.discount > 20 ? 250000 : 100000,
            },
          }));

          setVouchers(demoData);
        } catch (err) {
          setError('Đã xảy ra lỗi khi tải ưu đãi.');
          console.error('Voucher fetch error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchAndFilterVouchers();
    }
  }, [visible]);

  const handleApplyVoucher = (voucher) => {
    if (onApplyVoucher && typeof onApplyVoucher === 'function') {
      onApplyVoucher(voucher);
    }
    onClose();
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.infoText}>Lỗi: {error}</Text>;
    }
    if (vouchers.length === 0) {
      return <Text style={styles.infoText}>Bạn không có ưu đãi nào còn hiệu lực.</Text>;
    }
    return (
      <FlatList
        data={vouchers}
        renderItem={({ item }) => (
          <VoucherItem
            voucherData={item}
            onApply={() => handleApplyVoucher(item)}
            isSelected={selectedVoucher?._id === item._id}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ưu đãi cho bạn</Text>
          </View>
          <View style={styles.body}>{renderContent()}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '75%',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6B7280',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default VoucherModal;
