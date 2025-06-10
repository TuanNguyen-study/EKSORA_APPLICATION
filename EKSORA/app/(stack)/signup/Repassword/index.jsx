import React, { useState }  from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { sendotp} from '../../.../../../../API/services/AxiosInstance'; 
import { useRouter } from 'expo-router';

const Index = () => {
   const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

   const handleSendOTP = async () => {
  if (!email.trim()) {
    Alert.alert('Lỗi', 'Vui lòng nhập email hoặc số điện thoại');
    return;
  }

  try {
    setLoading(true);
    await dispatch(sendotp(email)).unwrap();
    Alert.alert('Thành công', 'Mã OTP đã được gửi!');
    router.replace({
      pathname: '/(stack)/signup/OTP',
      params: { email }, 
    });
  } catch (error) {
    console.log('Gửi OTP lỗi:', error, error?.response?.data);
    Alert.alert('Lỗi', error?.response?.data?.message || 'Gửi OTP thất bại');
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>

      <View style={styles.inputContainer}>
        <Feather name="mail" size={18} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
           value={email}
            onChangeText={setEmail}
          placeholder="email-address"
          placeholderTextColor="#999"
           autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
        <Text style={styles.buttonText}>Xác Thực</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportContainer}>
        <Text style={styles.supportText}>Hỗ trợ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 30,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0086CD',
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  supportContainer: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  supportText: {
    textDecorationLine: 'underline',
    color: '#000',
  },
});
