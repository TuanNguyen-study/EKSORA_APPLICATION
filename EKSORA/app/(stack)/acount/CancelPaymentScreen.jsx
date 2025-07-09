import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/colors'; // sửa lại đường dẫn nếu cần

export default function CancelPaymentScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="close-circle-outline" size={64} color={COLORS.danger} />
      <Text style={styles.title}>Bạn đã huỷ thanh toán</Text>
      <Text style={styles.message}>Giao dịch chưa được thực hiện. Vui lòng thử lại nếu bạn vẫn muốn tiếp tục đặt tour.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.buttonText}>Quay về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginTop: 20
  },
  message: {
    fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginVertical: 16
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold'
  }
});
