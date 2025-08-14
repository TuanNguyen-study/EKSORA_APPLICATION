// VoucherModal.js
import React, { useState, useEffect, useMemo } from 'react';
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

// Màu sắc để dễ quản lý
const COLORS = {
  primary: '#F97316',
  background: '#F9FAFB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  border: '#E5E7EB',
};

const VoucherModal = ({ visible, onClose, onApplyVoucher, selectedVoucher }) => {
  const [activeTab, setActiveTab] = useState('available'); // 'available' hoặc 'unavailable'
  const [allVouchers, setAllVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchVouchers = async () => {
        setLoading(true);
        setError(null);
        try {
          const userId = await AsyncStorage.getItem("USER_ID");
          if (!userId) throw new Error('Không tìm thấy thông tin người dùng.');

          const userVouchers = await getVouchersByUserId(userId);
          if (!Array.isArray(userVouchers)) throw new Error('Dữ liệu API không hợp lệ');

          // Xử lý dữ liệu demo ngay tại đây
          const processedVouchers = userVouchers
            .filter(item => item.voucher_id) // Lọc những item có voucher_id
            .map(v => ({
              ...v,
              voucher_id: {
                ...v.voucher_id,
                // Thêm min_order_value nếu cần, nếu không thì xóa dòng này
                min_order_value: v.voucher_id.discount > 20 ? 250000 : 100000,
              },
            }));

          setAllVouchers(processedVouchers);
        } catch (err) {
          setError(err.message);
          console.error('Lỗi khi tải voucher:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchVouchers();
    }
  }, [visible]);

  // Sử dụng useMemo để tối ưu, chỉ lọc lại khi allVouchers thay đổi
  const { availableVouchers, unavailableVouchers } = useMemo(() => {
    const now = new Date();
    const available = allVouchers.filter(item => new Date(item.voucher_id.end_date) > now);
    const unavailable = allVouchers.filter(item => new Date(item.voucher_id.end_date) <= now);
    return { availableVouchers: available, unavailableVouchers: unavailable };
  }, [allVouchers]);

const handleApplyOrCancel = (voucher) => {
  const isRemoving = selectedVoucher?._id === voucher._id;

  if (isRemoving) {
    // Bỏ chọn → không cần kiểm tra hợp lệ
    onApplyVoucher(null);
    onClose();
    return;
  }

  // Chỉ kiểm tra khi áp dụng
  if (!voucher?.voucher_id || !voucher.voucher_id.discount) {
    alert("Voucher này không hợp lệ hoặc thiếu thông tin quan trọng");
    return;
  }

  onApplyVoucher(voucher);
  onClose();
};

  
  const renderList = (data, isUsable) => (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <VoucherItem
          voucherData={item}
          onAction={handleApplyOrCancel}
          isSelected={selectedVoucher?._id === item._id}
          isUsable={isUsable}
        />
      )}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<Text style={styles.infoText}>Không có ưu đãi trong mục này.</Text>}
    />
  );

  const renderContent = () => {
    if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
    if (error) return <Text style={styles.infoText}>Lỗi: {error}</Text>;
    
    return activeTab === 'available'
      ? renderList(availableVouchers, true)
      : renderList(unavailableVouchers, false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chọn ưu đãi</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'available' && styles.activeTab]}
              onPress={() => setActiveTab('available')}
            >
              <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
                Có thể dùng ({availableVouchers.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'unavailable' && styles.activeTab]}
              onPress={() => setActiveTab('unavailable')}
            >
              <Text style={[styles.tabText, activeTab === 'unavailable' && styles.activeTabText]}>
                Hết hiệu lực ({unavailableVouchers.length})
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Body */}
          <View style={styles.body}>{renderContent()}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '85%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    backgroundColor: COLORS.border,
    borderRadius: 20,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default VoucherModal;