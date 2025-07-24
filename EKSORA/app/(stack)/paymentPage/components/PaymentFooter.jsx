import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PaymentFooter = ({ totalAmount, onPayPress, styles }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
      <View>
        <Text style={styles.footerTotalLabel}>Tổng cộng</Text>
        <Text style={styles.footerTotalAmount}>
          {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </Text>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={onPayPress}>
        <Text style={styles.payButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(PaymentFooter);