import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../../../constants/colors";

export default function ContactInfoInput() {
  const router = useRouter();

  const booking = {
    title: "Tour Tham Quan Ninh Bình Trong Ngày, Khởi Hành Từ Thành Phố Hồ Chí Minh",
    date: "16/5/2025",
    quantityAdult: 1,
    price: 747000,
  };

  const [contactInfo, setContactInfo] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const openModal = (field) => {
    setCurrentField(field);
    setInputValue(contactInfo[field] || "");
    setModalVisible(true);
  };

  const saveInput = () => {
    setContactInfo((prev) => ({ ...prev, [currentField]: inputValue }));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Hoàn tất đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>{booking.title}</Text>
          <Text style={styles.text}>Vé tiêu chuẩn</Text>
          <Text style={styles.text}>{booking.date}</Text>
          <Text style={styles.text}>Người Lớn x{booking.quantityAdult}</Text>
          <Text style={styles.priceText}>{booking.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeader}>Thông tin liên lạc:</Text>
          <Text style={styles.infoText}>Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>

          {["lastName", "firstName", "phone", "email"].map((field) => (
            <View key={field} style={styles.contactRow}>
              <Text style={styles.label}>
                {field === "lastName"
                  ? "Họ"
                  : field === "firstName"
                  ? "Tên"
                  : field === "phone"
                  ? "Số điện thoại"
                  : "Địa chỉ email"}
              </Text>
              <TouchableOpacity onPress={() => openModal(field)}>
                <Text style={styles.inputText}>
                  {contactInfo[field] ? contactInfo[field] : <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>Nhập</Text>}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeader}>Giảm giá</Text>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Mã ưu đãi nền tảng</Text>
            <Text style={styles.discountValue}>Không khả dụng</Text>
          </View>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Mã ưu đãi thanh toán</Text>
            <Text style={styles.discountValue}>Không khả dụng</Text>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            Tôi đã hiểu và đồng ý với{" "}
            <Text style={styles.linkText}>Điều Khoản Sử dụng Chung</Text> và{" "}
            <Text style={styles.linkText}>Chính sách Quyền riêng tư của EKSORA</Text>
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Xin điền thông tin cần thiết. Khi đã gửi sẽ không thể thay đổi.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceRow}>
          <Text style={styles.totalPrice}>{booking.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
          <Text style={styles.discountAmount}>Giảm 64,000đ</Text>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm thông tin liên lạc</Text>
            <Text style={styles.modalLabel}>
              {currentField === "lastName"
                ? "Họ"
                : currentField === "firstName"
                ? "Tên"
                : currentField === "phone"
                ? "Số điện thoại"
                : "Địa chỉ email"}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={
                currentField === "lastName"
                  ? "Viết không dấu (VD: Vo Huynh)"
                  : currentField === "firstName"
                  ? "Viết không dấu (VD: Tuan Anh)"
                  : currentField === "phone"
                  ? "Xin chọn / Vui lòng nhập"
                  : "Vui lòng nhập"
              }
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={currentField === "phone" ? "phone-pad" : "default"}
              autoFocus
            />
            <Text style={styles.modalNotice}>
              Tôi hiểu rằng bất kỳ thông tin ID nào được cung cấp sẽ chỉ được sử dụng để đặt các dịch vụ du lịch và nghỉ dưỡng cần sử dụng tên để đăng kí. Tôi cũng hiểu rằng EKSORA sẽ bảo vệ thông tin này bằng cách sử dụng mã hóa và các phương pháp bảo vệ khác, và EKSORA chỉ cho phép sử dụng thông tin đó với các bên thứ ba có liên quan cho các giao dịch cụ thể
            </Text>
            <TouchableOpacity style={styles.modalSaveButton} onPress={saveInput}>
              <Text style={styles.modalSaveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingTop: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 100,
    fontWeight: "bold",
    fontSize: 14,
  },
  inputText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  discountLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  discountValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
  noticeBox: {
    backgroundColor: "#f0f4f8",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  infoBox: {
    backgroundColor: "#d9edf7",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  discountAmount: {
    fontSize: 14,
    color: COLORS.primary,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  payButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 12,
  },
  modalNotice: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 12,
  },
  modalSaveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  modalSaveButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
