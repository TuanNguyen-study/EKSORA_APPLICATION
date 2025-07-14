import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "../../../constants/colors";


const paymentMethods = [
  { id: "Payos", label: "Payos" },
  { id: "atm", label: "ATM by MoMo", note: "Hoàn tiền không áp dụng cho lựa chọn thanh toán của bạn" },
  { id: "credit", label: "Thêm/Quản lý Thẻ tín dụng" },
  { id: "googlepay", label: "Google Pay" },
];


export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profile, setProfile] = useState(null);

  const { bookingId, title, quantityAdult, quantityChild, totalPrice, travelDate } = useLocalSearchParams();
  const params = useLocalSearchParams();
  useEffect(() => {
  (async () => {
    if (!bookingId) {
      const savedId = await AsyncStorage.getItem("PENDING_BOOKING_ID");
      if (savedId) {
        params.bookingId = savedId; // fallback gán lại
      } else {
        Alert.alert("Lỗi", "Không tìm thấy mã booking. Vui lòng đặt lại.");
      }
    }
  })();
}, []);

  console.log('🧾 Params nhận được:', params);
  // console.log("📷 image param:", image);

  const totalAmount = Number(totalPrice || 0);

  const bankIcons = {
    momo: "microsoft-xbox-controller-menu",
    atm: "bank-outline",
    credit: "credit-card-outline",
    googlepay: "google",
  };
  useEffect(() => {
    (async () => {
      const profStr = await AsyncStorage.getItem('USER_PROFILE');
      if (profStr) {
        try {
          setProfile(JSON.parse(profStr));
        } catch {
          console.warn('USER_PROFILE không phải JSON hợp lệ');
        }
      }
    })();
  }, []);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.methodRow}
      onPress={() => setSelectedMethod(item.id)}
    >
      <View style={styles.methodInfo}>
        <MaterialCommunityIcons name={bankIcons[item.id]} size={24} color={COLORS.primary} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.methodLabel}>{item.label}</Text>
          {item.note && <Text style={styles.methodNote}>{item.note}</Text>}
        </View>
      </View>
      <View style={styles.radioCircle}>
        {selectedMethod === item.id && <View style={styles.selectedRb} />}
      </View>
    </TouchableOpacity>
  );

  const handlePayment = async () => {
    if (!profile) {
      Alert.alert('Lỗi', 'Không có thông tin người dùng.');
      return;
    }
    if (!selectedMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    const payload = {
      amount: totalAmount,
      description: `Thanh toán đơn hàng ${title || 'không tên'}`,
      buyerName: `${profile.firstName} ${profile.lastName}`,
      buyerEmail: profile.email,
      buyerPhone: profile.phone,
      buyerAddress: profile.address,
      booking_id: bookingId,
    };
    await AsyncStorage.setItem("PENDING_BOOKING_ID", bookingId);

    

    console.log('🔀 Dữ liệu gửi sang API tạo thanh toán:');
    console.log('💰 Amount:', payload.amount);
    console.log('📄 Description:', payload.description);
    console.log('👤 Name:', payload.buyerName);
    console.log('📧 Email:', payload.buyerEmail);
    console.log('📞 Phone:', payload.buyerPhone);
    console.log('🏠 Address:', payload.buyerAddress);
    console.log('🆔 Booking ID:', payload.booking_id);

    try {
      const response = await fetch('http://160.250.246.76:3000/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📤 HTTP status:', response.status);

      const contentType = response.headers.get('content-type');
      const rawText = await response.text();

      let data;
      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(rawText);
        } catch (err) {
          console.error('❌ Không parse được JSON:', err);
          return Alert.alert('Lỗi', 'Dữ liệu phản hồi không hợp lệ từ server.');
        }
      } else {
        console.error('❌ Server trả về không phải JSON:', rawText);
        return Alert.alert('Lỗi', rawText || 'Lỗi không xác định từ server.');
      }

      if (!response.ok) {
        const msg = data?.message || rawText;
        console.error(`❌ API lỗi ${response.status}:`, msg);
        return Alert.alert(`Lỗi ${response.status}`, msg);
      }
      

      // if (!data.url) {
      //   console.error('❌ Không tìm thấy URL trong phản hồi:', data);
      //   return Alert.alert('Lỗi', 'Phản hồi không hợp lệ từ server.');
      // }
      if (data.url) {
        router.push({
         pathname: "/acount/payment-webview",
          params: { 
           checkoutUrl: encodeURIComponent(data.url)
          }
        });
      }

      console.log('✅ Mở URL thanh toán:', data.url);
      console.log('🆔 Booking ID:', data.booking_id);
      // Linking.openURL(data.url);

    } catch (err) {
      console.error('🔥 Exception khi tạo payment link:', err);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo thanh toán.');
      console.error('❌ Lỗi tạo thanh toán:', err.message);
    }

  }




  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.totalAmount}>
          {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowOrderDetails(!showOrderDetails)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
            <Text style={styles.dropdownText}>Thông tin đơn hàng</Text>
            <Ionicons name={showOrderDetails ? "chevron-up" : "chevron-down"} size={20} color={COLORS.white} />
          </View>
        </TouchableOpacity>
        {showOrderDetails && (
          <View style={styles.orderDetailsContainer}>
            {/* {image && (
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Image
                source={{ uri: image }}
                style={styles.tourImage}
                resizeMode="cover"
              />
            </View>
          )} */}

            <Text style={styles.sectionTitle}>Thông tin liên lạc:</Text>
            <Text style={styles.orderInfo}>
              {`${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`}
            </Text>
            <Text style={styles.orderInfo}>{`${profile?.phone ?? ''}`}</Text>
            <Text style={styles.orderInfo}>{`${profile?.email ?? ''}`}</Text>
            {/* <Text style={styles.orderInfo}>{profile?.address}</Text> */}

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>{`${title ?? ''}`}</Text>
            <Text style={styles.orderInfo}>{`${travelDate ?? ''}`}</Text> {/* Có thể truyền selectedDate nếu muốn */}
            <Text style={styles.orderInfo}>
              {`${quantityAdult} x Người lớn, ${quantityChild} x Trẻ em (5-8)`}
            </Text>

            <Text style={styles.orderPrice}>₫ {totalAmount.toLocaleString("vi-VN")}</Text>

            <View style={styles.separator} />


            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalAmountBold}>₫ {totalAmount.toLocaleString("vi-VN")}</Text>
            </View>
          </View>
        )}


        <TouchableOpacity style={styles.discountButton}>
          <Text style={styles.discountButtonText}>Sử dụng ưu đãi thanh toán</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        <FlatList
          data={paymentMethods}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.methodList}
          scrollEnabled={false}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.payNowButton}
        onPress={handlePayment}
      >
        <Text style={styles.payNowButtonText}>Thanh toán ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004080",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 10,
  },
  totalAmount: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  dropdownText: {
    color: COLORS.white,
    fontSize: 16,
  },
  discountButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    alignSelf: "center",
  },
  discountButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginRight: 8,
  },
  methodList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 8,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  methodNote: {
    fontSize: 12,
    color: COLORS.gray,
  },
  payNowButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    bottom: 10
  },
  payNowButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  orderDetailsContainer: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  orderText: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  tourImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.black,
  },

  orderInfo: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
  },

  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 4,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginVertical: 8,
  },

  totalAmountBold: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: COLORS.black,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 14,

    color: COLORS.black,
  },

});
