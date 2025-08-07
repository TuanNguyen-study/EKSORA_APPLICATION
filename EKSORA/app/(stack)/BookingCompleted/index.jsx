import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from 'react-redux';

import { updateUserProfile } from '../../../API/services/servicesProfile';
import { COLORS } from "../../../constants/colors";
import BookingSummaryCard from "./components/BookingCard";
import ContactInfoSection from "./components/ContactInfoSection";

export default function BookingCompleted() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Lấy thông tin người dùng đã đăng nhập từ Redux
  const loggedInUser = useSelector((state) => state.auth.user);

  // Xử lý và chuẩn hóa dữ liệu booking từ params bằng useMemo để tối ưu hiệu năng
  const { displayItems, finalTotalPrice } = useMemo(() => {
    // Trường hợp 1: Dữ liệu từ giỏ hàng (một mảng items)
    if (params.items && typeof params.items === 'string') {
      try {
        const parsedItems = JSON.parse(params.items);
        const itemsForDisplay = parsedItems.map(item => ({
          ...item,
          title: item.name,
          totalPrice: item.price,
          quantityAdult: item.adults,
          quantityChild: item.children,
        }));
        return {
          displayItems: itemsForDisplay,
          finalTotalPrice: Number(params.totalPrice),
        };
      } catch (e) {
        console.error("Lỗi parse JSON từ giỏ hàng:", e);
        return { displayItems: [], finalTotalPrice: 0 };
      }
    }

    // TRƯỜNG HỢP 2: Dữ liệu đến từ Đặt ngay (props riêng lẻ)
    const singleItem = {
      id: params.bookingId,
      title: params.title,
      quantityAdult: params.quantityAdult,
      quantityChild: params.quantityChild,
      totalPrice: Number(params.totalPrice),
      travelDate: params.travelDate,
    };
    return {
      displayItems: [singleItem],
      finalTotalPrice: Number(params.totalPrice),
    };
  }, [params]);

  // ----- STATE MANAGEMENT CHO THÔNG TIN LIÊN LẠC -----

  // State quyết định hiển thị tab "Thông tin của tôi" hay form chỉnh sửa
  const [isUsingSavedInfo, setIsUsingSavedInfo] = useState(true);

  // State chứa dữ liệu để *hiển thị* cho người dùng trong tab "Thông tin của tôi"
  const [contactToDisplay, setContactToDisplay] = useState(loggedInUser || {});

  // State chứa dữ liệu của form nhập liệu (khi chỉnh sửa hoặc nhập mới)
  const [formInfo, setFormInfo] = useState({
    lastName: loggedInUser?.lastName || "",
    firstName: loggedInUser?.firstName || "",
    phone: loggedInUser?.phone || "",
    email: loggedInUser?.email || "",
  });

  // State cho trạng thái loading khi gọi API
  const [loading, setLoading] = useState(false);

  // useEffect để lấy thông tin người dùng từ API nếu trong Redux không có
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (loggedInUser) {
        setContactToDisplay(loggedInUser);
        setFormInfo({
          lastName: loggedInUser.lastName || "",
          firstName: loggedInUser.firstName || "",
          phone: loggedInUser.phone || "",
          email: loggedInUser.email || "",
        });
        return;
      }
      // Nếu không, gọi API
      try {
        const token = await AsyncStorage.getItem("ACCESS_TOKEN");
        if (token) {
          const userProfile = await updateUserProfile(token, {});
          setContactToDisplay(userProfile);
          setFormInfo({
            lastName: userProfile.lastName || "",
            firstName: userProfile.firstName || "",
            phone: userProfile.phone || "",
            email: userProfile.email || "",
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserProfile();
  }, [loggedInUser]);

  // ----- CÁC HÀM XỬ LÝ SỰ KIỆN -----

  // Cập nhật state của form khi người dùng nhập liệu
  const handleFormInputChange = (field, value) => {
    setFormInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý khi người dùng nhấn nút "Chỉnh sửa"
  const handleEditContact = () => {
    setIsUsingSavedInfo(false); // Chuyển sang giao diện form
    setFormInfo({
      lastName: contactToDisplay.lastName || '',
      firstName: contactToDisplay.firstName || '',
      phone: contactToDisplay.phone || '',
      email: contactToDisplay.email || '',
    });
  };

  // Xử lý khi người dùng nhấn nút "Xác nhận" trên form
  const handleConfirmNewContact = async () => {
    const { firstName, lastName, phone, email } = formInfo;
    if (!firstName || !lastName || !phone || !email) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      // 1. Gọi API để cập nhật thông tin trên server
      await updateUserProfile(token, formInfo);

      // 2. Cập nhật lại state hiển thị bằng chính thông tin vừa nhập
      setContactToDisplay(formInfo);

      // 3. Chuyển về lại tab "Thông tin của tôi"
      setIsUsingSavedInfo(true);

      Alert.alert('Thành công', 'Thông tin của bạn đã được cập nhật!');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhấn nút "Thanh toán"
  const handlePayment = () => {
    // 1. Kiểm tra xem có thông tin liên lạc hay không
    if (!contactToDisplay.firstName || !contactToDisplay.phone) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng xác nhận thông tin liên lạc của bạn để tiếp tục."
      );
      handleEditContact();
      return;
    }

    router.push({
      pathname: "/paymentPage",

      // params chính là gói dữ liệu bạn gửi đi
      params: {
        ...params,
        fullName: `${contactToDisplay.lastName} ${contactToDisplay.firstName}`,
        phone: contactToDisplay.phone,
        email: contactToDisplay.email,

        // Gửi lại thông tin đơn hàng để màn hình thanh toán hiển thị
        items: JSON.stringify(displayItems),
        totalPrice: finalTotalPrice,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoàn tất đơn hàng</Text>
        <View style={styles.headerButton} />
      </View>

              <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Phần thông tin liên lạc */}
        <ContactInfoSection
          isUsingSavedInfo={isUsingSavedInfo}
          setIsUsingSavedInfo={setIsUsingSavedInfo}
          contactToDisplay={contactToDisplay}
          formInfo={formInfo}
          setFormInfo={setFormInfo}
          handleFormInputChange={handleFormInputChange}
          handleConfirmNewContact={handleConfirmNewContact}
          handleEditContact={handleEditContact}
          loading={loading}
        />
        
        {/* Render danh sách Card booking */}
        {displayItems.map((item) => (
          <BookingSummaryCard
            key={item.id}
            title={item.title}
            travelDate={item.travelDate}
            quantityAdult={item.quantityAdult}
            quantityChild={item.quantityChild}
            totalPrice={item.totalPrice}
          />
        ))}

        
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Tổng cộng</Text>
          <Text style={styles.footerPrice}>
            {finalTotalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, (loading || !contactToDisplay.firstName) && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading || !contactToDisplay.firstName}
        >
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
</KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ----- STYLES -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7', 
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContentContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start", 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 14,
    color: COLORS.gray,
   
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  payButtonDisabled: {
    backgroundColor: COLORS.gray_2,
  },
  payButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});