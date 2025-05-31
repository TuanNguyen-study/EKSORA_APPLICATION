import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function Body() {
  return (
    <View style={styles.body}>
      {/* Box chứa danh sách */}
      <View style={styles.box}>
        <View style={styles.item}>
          <Ionicons name="document-text-outline" size={20} color="black" />
          <Text style={styles.label}>Đơn hàng</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.item}>
          <Ionicons name="gift-outline" size={20} color="black" />
          <Text style={styles.label}>Eskora Rewards</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.itemColumn}>
          <View style={styles.item}>
            <Ionicons name="person-outline" size={20} color="black" />
            <Text style={styles.label}>Thông tin người dùng</Text>
          </View>
          <Text style={styles.sub}>
            Quản lý thông tin khách trên đơn hàng, địa chỉ và phương thức thanh toán
          </Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.item}>
          <MaterialIcons name="rate-review" size={20} color="black" />
          <Text style={styles.label}>Đánh giá</Text>
        </View>
      </View>

      {/* Trợ giúp & Cài đặt */}
      <View style={styles.extra}>
        <View style={styles.item}>
          <Ionicons name="help-circle-outline" size={20} color="black" />
          <Text style={styles.label}>Trợ giúp</Text>
        </View>
        <View style={styles.separatorThin} />
        <View style={styles.item}>
          <Ionicons name="settings-outline" size={20} color="black" />
          <Text style={styles.label}>Cài đặt</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
  box: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 35,   
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 10,
    marginLeft: 15,
    margin: 5,
  },
  itemColumn: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#000',
  },
  sub: {
    fontSize: 12,
    color: '#666',
    marginLeft: 30,
    marginTop: -6,
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginLeft: 30,
  },
  separatorThin: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 4,
  },
  extra: {
    paddingHorizontal: 4,
  },
});
