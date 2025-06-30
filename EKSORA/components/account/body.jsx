import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../../constants/colors';  


export default function Body() {
  const router = useRouter();
  return (
    <View style={styles.bodyContainer}>
      <View style={styles.box}>
        <TouchableOpacity
          onPress={() => router.push("/trips")}

        >
          <Ionicons name="receipt-outline" size={24} color={COLORS.textDark} style={styles.icon} />
          <Text style={styles.label}>Đơn hàng</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textGray} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.touchableItemColumn} onPress={() => router.push('/MyOrder/UserInfoForm')}>
          <View style={styles.itemRow}>
            <Ionicons name="person-outline" size={24} color={COLORS.textDark} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Thông tin thường dùng</Text>
              <Text style={styles.sub}>
                Quản lý thông tin khách trên đơn hàng, địa chỉ và phương thức thanh toán
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textGray} />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.touchableItem} onPress={() => router.push('/TourReview/ReviewScreen')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.textDark} style={styles.icon}/>
          <Text style={styles.label}>Đánh giá</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textGray} />
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <TouchableOpacity style={styles.touchableItem} onPress={() => router.push('/MyOrder/HelpScreen')}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.textDark} style={styles.icon}/>
          <Text style={styles.label}>Trợ giúp</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textGray} />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.touchableItem}
          onPress={() => router.push("/(stack)/acount/settingScreen")}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.textDark} style={styles.icon}/>
          <Text style={styles.label}>Cài đặt</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textGray} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 16, 
    backgroundColor: COLORS.white, 
  },
  box: {
    borderRadius: 12,
    backgroundColor: COLORS.white, 
    marginBottom: 16, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  touchableItem: { 
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  touchableItemColumn: { 
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  itemRow: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: { 
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
    flex: 1, 
  },
  sub: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 3,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: COLORS.separatorLight,
    marginLeft: 16 + 24 + 15,
  },
});