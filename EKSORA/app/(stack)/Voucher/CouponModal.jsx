import React, { useState, useCallback } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useVoucher } from '../../../store/VoucherContext';
import CouponTicket from './CouponTicket';
import { COLORS } from '../../../constants/colors';

const CouponModal = ({ visible, onClose }) => {
  const { coupons, loading, saveVoucher } = useVoucher();
  const [savingVoucherId, setSavingVoucherId] = useState(null);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${day}/${month} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const renderCoupon = useCallback(({ item }) => {
    const isSaving = savingVoucherId === item.id;

    return (
      <CouponTicket
        mainTitle={item.condition}
        expiryText={item.expiry ? `Hết hạn: ${formatDate(item.expiry)}` : null}
        discountAmount={item.discount}
        detailsText={`Mã: ${item.id}`}
        status={item.isSaved ? 'saved' : 'available'}
        onToggleStatus={async () => {
          if (!item.isSaved && !isSaving) {
            setSavingVoucherId(item.id);
            await saveVoucher(item.id);
            setSavingVoucherId(null);
          }
        }}
        loading={isSaving}
      />
    );
  }, [savingVoucherId, saveVoucher]);

  const getItemLayout = (_, index) => ({
    length: 135,
    offset: 135 * index,
    index,
  });

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text onPress={onClose} style={styles.closeButtonText}>✕</Text>
              <Text style={styles.headerTitle}>Quà tặng bạn mới</Text>
              <Text style={styles.headerSubtitle}>Giảm đến 10%</Text>
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primaryBlue}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <FlatList
                data={coupons}
                renderItem={renderCoupon}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    Hiện chưa có mã ưu đãi.
                  </Text>
                }
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={3}
                getItemLayout={getItemLayout}
                removeClippedSubviews={false}
              />
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Xem ưu đãi trong Tài khoản của bạn</Text>
              <View style={styles.termsContainer}>
                <Text style={styles.footerText}>Điều khoản & Điều kiện</Text>
                <View style={styles.infoIcon}>
                  <Text style={styles.infoIconText}>i</Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    maxHeight: '70%',
  },
  header: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.black,
    position: 'absolute',
    left: 20,
    top: 15,
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
    padding: 20,
    backgroundColor: COLORS.white,
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
