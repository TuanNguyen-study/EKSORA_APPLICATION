import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from 'react-redux';
import { COLORS } from "../../../constants/colors";



export default function BookingCompleted() {
  const router = useRouter();
  const { bookingId,title, quantityAdult, quantityChild, totalPrice, travelDate ,image } = useLocalSearchParams();
  const user = useSelector((state) => state.auth.user); // lấy user đăng nhập từ redux
  const [useSavedUser, setUseSavedUser] = useState(true);
  const [newUser, setNewUser] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
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
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.text}>Vé tiêu chuẩn</Text>
          <Text style={styles.text}>Ngày tham gia: {travelDate}</Text>
          <Text style={styles.text}> Người lớn x {quantityAdult}</Text>
          <Text style={styles.text}> Trẻ em x {quantityChild}</Text>
          <Text style={styles.priceText}>
            {Number(totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeader}>Thông tin liên lạc:</Text>
          <Text style={styles.infoText}>Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setUseSavedUser(true)}
              style={[
                styles.optionBox,
                useSavedUser && styles.optionBoxSelected
              ]}>
              <Text style={[styles.optionText, useSavedUser && styles.optionTextSelected]}>
                {(newUser ? `${newUser.firstName} ${newUser.lastName}` : `${user?.firstName} ${user?.lastName}`)?.toUpperCase()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setUseSavedUser(false)}
              style={[
                styles.optionBox,
                !useSavedUser && styles.optionBoxSelected
              ]}>
              <Text style={[styles.optionText, !useSavedUser && styles.optionTextSelected]}>
                + Thêm
              </Text>
            </TouchableOpacity>
          </View>


          {useSavedUser ? (
            <View style={styles.userInfoCard}>
              <View style={styles.userRow}>
                <Text style={styles.userLabel}>First name</Text>
                <Text style={styles.userValue}>{newUser?.firstName || user?.firstName}</Text>
              </View>
              <View style={styles.userRow}>
                <Text style={styles.userLabel}>Last name</Text>
                <Text style={styles.userValue}>{newUser?.lastName || user?.lastName}</Text>
              </View>
              <View style={styles.userRow}>
                <Text style={styles.userLabel}>Phone number</Text>
                <Text style={styles.userValue}>+84 {newUser?.phone || user?.phone}</Text>
              </View>
              <View style={styles.userRow}>
                <Text style={styles.userLabel}>Email address</Text>
                <Text style={styles.userValue}>{newUser?.email || user?.email}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>

          ) : (
            <>
              <View style={styles.contactRow}>
                <Text style={styles.label}>Họ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ"
                  value={contactInfo.lastName}
                  onChangeText={(text) => handleInputChange("lastName", text)}
                />
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.label}>Tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên"
                  value={contactInfo.firstName}
                  onChangeText={(text) => handleInputChange("firstName", text)}
                />
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  value={contactInfo.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                />
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  value={contactInfo.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              const { firstName, lastName, phone, email } = contactInfo;
              if (!firstName || !lastName || !phone || !email) {
                alert("Vui lòng nhập đầy đủ thông tin!");
                return;
              }

              setNewUser({ ...contactInfo });
              setUseSavedUser(true); // Chuyển lại tab hiển thị
            }}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
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
          <Text style={styles.totalPrice}>
            {Number(totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            
            router.push({
              
              pathname: "/acount/paymentPage",
              params: {
                bookingId,
                title,
                quantityAdult,
                quantityChild,
                totalPrice,
                travelDate,
                fullName: `${newUser?.lastName || user?.lastName} ${newUser?.firstName || user?.firstName}`,
                phone: newUser?.phone || user?.phone,
                email: newUser?.email || user?.email,
                image,
              }
            });
            console.log("🔁 image gửi đi:", image);
          }}
          
        >
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  editText: {
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: "bold",
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


  choiceButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',         // Màu viền xanh dương
    backgroundColor: '#D8EBFF',     // Màu nền xanh nhạt
    borderRadius: 20,
    marginRight: 8,
  },
  choiceButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  choiceText: {
    color: '#000',
    fontWeight: 'bold',
  },
  choiceTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfoBox: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  userInfoText: {
    fontSize: 14,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  userTab: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  userTabActive: {
    backgroundColor: '#FFEDE0',
    borderColor: '#FF6600',
  },
  userTabText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userTabTextActive: {
    color: '#FF6600',
  },
  userInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  userValue: {
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    alignSelf: 'flex-end',
  },

  optionBox: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginRight: 8,
  },

  optionBoxSelected: {
    backgroundColor: '#D8EBFF', // Nền xanh nhạt
    borderColor: '#007AFF',     // Viền xanh đậm
  },

  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666', // Xám nhẹ cho trạng thái chưa chọn
  },

  optionTextSelected: {
    color: '#000', // Đen khi được chọn
  },
  confirmButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 12,
},

confirmButtonText: {
  color: COLORS.white,
  fontWeight: 'bold',
  fontSize: 14,
},



});
