import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { useSelector } from 'react-redux';

import { COLORS } from "../../../../constants/colors";
import BookingSummaryCard from "./components/BookingCard";
import ContactInfoSection from "./components/ContactInfoSection";

export default function BookingCompleted() {
  const router = useRouter();
  const params = useLocalSearchParams(); 

  const loggedInUser = useSelector((state) => state.auth.user);

  //  Xử lý dữ liệu từ cả 2 nguồn 
  const { displayItems, finalTotalPrice } = useMemo(() => {
    // TRƯỜNG HỢP 1: Dữ liệu đến từ Giỏ hàng
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

  // State và các hàm xử lý cho ContactInfoSection 
  const [isUsingSavedInfo, setIsUsingSavedInfo] = useState(true);
  const [customInfo, setCustomInfo] = useState(null);
  const [formInfo, setFormInfo] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
  });

  const effectiveContact = useMemo(() => {
    if (isUsingSavedInfo) {
      return customInfo || loggedInUser;
    }
    return null;
  }, [isUsingSavedInfo, customInfo, loggedInUser]);

  const contactToDisplay = customInfo || loggedInUser;

  const handleFormInputChange = (field, value) => {
    setFormInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmNewContact = () => {
    const { firstName, lastName, phone, email } = formInfo;
    if (!firstName || !lastName || !phone || !email) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setCustomInfo(formInfo);
    setIsUsingSavedInfo(true);
  };

  const handlePayment = () => {
    if (!effectiveContact) {
      Alert.alert("Thiếu thông tin", "Vui lòng xác nhận thông tin liên lạc để tiếp tục.");
      return;
    }
    
    // Chuyển tiếp tất cả params nhận được, cộng thêm thông tin liên lạc
    router.push({
      pathname: "/acount/paymentPage",
      params: {
        ...params, 
        fullName: `${effectiveContact.lastName} ${effectiveContact.firstName}`,
        phone: effectiveContact.phone,
        email: effectiveContact.email,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header  */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoàn tất đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Render danh sách các Card, dù là 1 hay nhiều */}
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
        
        {/* Phần thông tin liên lạc  */}
        <ContactInfoSection
          isUsingSavedInfo={isUsingSavedInfo}
          setIsUsingSavedInfo={setIsUsingSavedInfo}
          contactToDisplay={contactToDisplay}
          formInfo={formInfo}
          handleFormInputChange={handleFormInputChange}
          handleConfirmNewContact={handleConfirmNewContact}
        />
      </ScrollView>
      
      {/* Footer  */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Tổng cộng</Text>
          <Text style={styles.footerPrice}>
            {finalTotalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', 
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Thêm padding cho bottom safe area
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
  payButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});