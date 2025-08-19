import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useSelector } from "react-redux";

import { updateUserProfile } from "../../../API/services/servicesProfile";
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
    console.log('>>> [BOOKING_COMPLETED] Processing params:', params);
    
    // Trường hợp 1: Dữ liệu từ giỏ hàng
    if (params.items && typeof params.items === "string") {
      try {
        const parsedItems = JSON.parse(params.items);
        console.log('>>> [BOOKING_COMPLETED] Parsed cart items:', parsedItems);
        
        const itemsForDisplay = parsedItems.map((item) => ({
          id: item.tour_id || item.id,
          title: item.name || "Tour du lịch",
          travelDate: item.travel_date || item.travelDate,
          quantityAdult: item.quantity_nguoiLon || item.adults || 0,
          quantityChild: item.quantity_treEm || item.children || 0,
          totalPrice: item.totalPrice || item.price || 0,
          voucherCode: item.voucherCode || null,
          discountAmount: item.discount || 0,
          originalPrice: item.originalPrice || item.price || 0,
          // Store original data for booking creation
          originalData: item
        }));

        console.log('>>> [BOOKING_COMPLETED] Formatted items for display:', itemsForDisplay);
        
        return {
          displayItems: itemsForDisplay,
          finalTotalPrice: Number(params.totalPrice),
        };
      } catch (e) {
        console.error(">>> [BOOKING_COMPLETED] Error parsing cart items:", e);
        return { displayItems: [], finalTotalPrice: 0 };
      }
    }

    // TRƯỜNG HỢP 2: Dữ liệu từ Đặt ngay
    const singleItem = {
      id: params.bookingId,
      title: params.title || "Tour du lịch",
      quantityAdult: Number(params.quantityAdult || 0),
      quantityChild: Number(params.quantityChild || 0),
      totalPrice: Number(params.totalPrice || 0),
      originalPrice: Number(params.originalPrice || params.totalPrice || 0),
      discountAmount: Number(params.discountAmount || 0),
      voucherCode: params.voucherCode,
      travelDate: params.travelDate,
    };

    console.log('>>> [BOOKING_COMPLETED] Direct booking item:', singleItem);
    
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
        console.error("Lỗi khi lấy thông tin người dùng:", error);
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
      lastName: contactToDisplay.lastName || "",
      firstName: contactToDisplay.firstName || "",
      phone: contactToDisplay.phone || "",
      email: contactToDisplay.email || "",
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

      Alert.alert("Thành công", "Thông tin của bạn đã được cập nhật!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra nguồn của booking
  const isPendingBooking = params.isPendingBooking === "true";
  const isFromCart = params.fromCart === "true";
  const isFromTicketPage = params.fromTicketPage === "true";
  const isFromDirectBooking = params.fromDirectBooking === "true";

  // Chỉ auto-redirect cho ticket page không phải direct booking
  const shouldAutoRedirect = isFromTicketPage && !isFromDirectBooking;
  
  // Text cho nút thanh toán dựa vào nguồn
  const getPaymentButtonText = () => {
    if (shouldAutoRedirect) return "Đang chuyển đến thanh toán...";
    if (isFromCart) return "Xác nhận";
    if (isFromDirectBooking) return "Xác nhận";
    if (isPendingBooking) return "Tiếp tục thanh toán";
    return "Hoàn tất đơn hàng";
  };

  // Auto-redirect đến paymentPage nếu là booking từ trang vé
  useEffect(() => {
    if (shouldAutoRedirect) {
      console.log(
        ">>> [BOOKING_COMPLETED] Detected booking from ticket page:",
        params.bookingId
      );
      console.log(">>> [BOOKING_COMPLETED] Contact info:", contactToDisplay);

      // Kiểm tra thông tin liên lạc
      if (
        contactToDisplay.firstName &&
        contactToDisplay.phone &&
        contactToDisplay.email
      ) {
        console.log(
          ">>> [BOOKING_COMPLETED] Auto-redirecting to paymentPage for ticket booking"
        );

        // Tự động chuyển đến paymentPage mà không cần user interaction
        const timer = setTimeout(() => {
          router.replace({
            pathname: "/(stack)/paymentPage",
            params: {
              ...params,
              fullName:
                `${contactToDisplay.lastName || ""} ${contactToDisplay.firstName}`.trim(),
              phone: contactToDisplay.phone,
              email: contactToDisplay.email,
              needCreateBooking: false, // Đã có booking rồi, không cần tạo mới
            },
          });
        }, 1000); // Delay 1 giây để user thấy trạng thái

        // Cleanup timer khi component unmount
        return () => clearTimeout(timer);
      } else {
        console.log(
          ">>> [BOOKING_COMPLETED] Missing contact info, waiting for user to complete"
        );
      }
    }
  }, [
    shouldAutoRedirect,
    contactToDisplay.firstName,
    contactToDisplay.phone,
    contactToDisplay.email,
    params,
    router,
  ]);

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

    // Tất cả các luồng đều đến paymentPage
    console.log(">>> [BOOKING_COMPLETED] Proceeding to payment");

    // Prepare common params
    // Prepare booking data
    let bookingData;
    if (isFromCart && params.items) {
      try {
        const cartItems = JSON.parse(params.items);
        // Convert the first cart item to booking data format
        const item = cartItems[0]; // For now, handle one item at a time
        console.log('>>> [BOOKING_COMPLETED] Processing cart item:', item);
        
        // Make sure we have contact info
        if (!contactToDisplay.firstName || !contactToDisplay.phone || !contactToDisplay.email) {
          throw new Error('Vui lòng cập nhật đầy đủ thông tin liên hệ');
        }

        // Calculate total price based on adult and child quantities
        const itemTotalPrice = (item.quantity_nguoiLon * item.price_nguoiLon) + 
                             ((item.quantity_treEm || 0) * (item.price_treEm || 0));
        
        bookingData = {
          user_id: item.user_id,
          tour_id: item.tour_id,
          travel_date: item.travel_date,
          quantity_nguoiLon: item.quantity_nguoiLon,
          quantity_treEm: item.quantity_treEm || 0,
          totalPrice: itemTotalPrice,
          price_nguoiLon: item.price_nguoiLon,
          price_treEm: item.price_treEm,
          optionServices: item.optionServices || [],
          coin: item.coin || 0,
          voucher_id: item.voucher_id || null,
          discount: item.discount || 0,
          status: 'pending',
          // Add required contact fields
          fullName: `${contactToDisplay.lastName || ""} ${contactToDisplay.firstName}`.trim(),
          email: contactToDisplay.email,
          phone: contactToDisplay.phone,
        };
        
        console.log('>>> [BOOKING_COMPLETED] Prepared booking data:', bookingData);
      } catch (error) {
        console.error('Error preparing booking data:', error);
        Alert.alert('Lỗi', 'Không thể xử lý dữ liệu đơn hàng');
        return;
      }
    }

    const paymentParams = {
      ...params, // Keep original params
      fullName: `${contactToDisplay.lastName || ""} ${contactToDisplay.firstName}`.trim(),
      phone: contactToDisplay.phone,
      email: contactToDisplay.email,
      buyerAddress: loggedInUser?.address || "Chưa có địa chỉ",
      totalPrice: finalTotalPrice.toString(),
      needCreateBooking: "true",
      // Add prepared booking data if from cart
      ...(isFromCart && { bookingData: JSON.stringify(bookingData) })
    };

    router.push({
      pathname: "/(stack)/paymentPage",
      params: paymentParams
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoàn tất đơn hàng</Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
              voucherCode={item.voucherCode}
              discountAmount={item.discountAmount}
              originalPrice={item.originalPrice}
            />
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Tổng cộng</Text>
            <Text style={styles.footerPrice}>
              {finalTotalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.payButton,
              (loading || !contactToDisplay.firstName || shouldAutoRedirect) &&
                styles.payButtonDisabled,
            ]}
            onPress={handlePayment}
            disabled={
              loading || !contactToDisplay.firstName || shouldAutoRedirect
            }
          >
            <Text style={styles.payButtonText}>{getPaymentButtonText()}</Text>
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
    backgroundColor: "#F4F5F7",
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
    borderBottomColor: "#f0f0f0",
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
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: "bold",
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