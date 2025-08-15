import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useVoucher } from "../../../store/VoucherContext";
import CouponTicket from "./CouponTicket";
import { COLORS } from "../../../constants/colors";

const CouponModal = ({ visible, onClose }) => {
  const { coupons, loading, saveVoucher } = useVoucher();
  const [savingVoucherId, setSavingVoucherId] = useState(null);

  // Lọc ra những mã voucher còn hạn sử dụng
  const validCoupons = coupons.filter((item) => {
    if (!item.expiry) return true; // Nếu không có ngày hết hạn thì vẫn hiển thị
    return new Date(item.expiry) > new Date();
  });

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${day}/${month} ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  const handleToggleStatus = useCallback(
    async (item) => {
      if (!item.isSaved && savingVoucherId !== item.id) {
        setSavingVoucherId(item.id);
        await saveVoucher(item.id);
        setSavingVoucherId(null);
      }
    },
    [savingVoucherId, saveVoucher]
  );

  const renderCoupon = useCallback(
    ({ item }) => {
      return (
        <CouponTicket
          mainTitle={item.condition}
          expiryText={
            item.expiry ? `Hết hạn: ${formatDate(item.expiry)}` : null
          }
          discountAmount={item.discount}
          detailsText={`Mã: ${item.id}`}
          status={item.isSaved ? "saved" : "available"}
          onToggleStatus={() => handleToggleStatus(item)}
          loading={savingVoucherId === item.id}
        />
      );
    },
    [handleToggleStatus, savingVoucherId]
  );

  const getItemLayout = (_, index) => ({
    length: 135,
    offset: 135 * index,
    index,
  });

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
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Quà tặng bạn mới</Text>
            <Text style={styles.headerSubtitle}>Giảm đến hơn 10%</Text>
          </View>

          {/* Body chứa FlatList */}
          <View style={styles.listContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primaryBlue}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <FlatList
                data={validCoupons}
                renderItem={renderCoupon}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Hiện chưa có mã ưu đãi nào khả dụng
                  </Text>
                }
                initialNumToRender={5} // Tăng nhẹ để lấp đầy màn hình ban đầu
                maxToRenderPerBatch={5}
                windowSize={5}
                getItemLayout={getItemLayout}
                removeClippedSubviews={true} // Bật lại để tối ưu bộ nhớ trên Android
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Xem ưu đãi trong Tài khoản của bạn
            </Text>
            <View style={styles.termsContainer}>
              <Text style={styles.footerText}>Điều khoản & Điều kiện</Text>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>i</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.primaryBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
  },
  header: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    left: 10,
    top: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 4,
  },

  listContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: COLORS.grayText,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: COLORS.white,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.grayText,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayText,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  infoIconText: {
    fontSize: 10,
    color: COLORS.grayText,
    fontWeight: "bold",
  },
});

export default CouponModal;
