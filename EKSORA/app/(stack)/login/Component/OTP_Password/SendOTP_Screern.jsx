import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { sendotp } from '../../../../../API/helpers/AxiosInstance'; 
import { COLORS } from '../../../../../constants/colors';
import { useRouter } from 'expo-router';

export default function SendOTPScreen() {
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
      router.replace('/(stack)/login/Component/OTP_Password/VerifyOTPScreen');
    } catch (error) {
      console.log('Gửi OTP lỗi:', error, error?.response?.data);
      Alert.alert('Lỗi', error?.response?.data?.message || 'Gửi OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gửi mã OTP</Text>
      <Text style={styles.subtitle}>Nhập email hoặc số điện thoại để nhận mã OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Email hoặc số điện thoại"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang gửi...' : 'Gửi mã OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, alignSelf: 'center' },
  subtitle: { fontSize: 16, color: COLORS.text, marginBottom: 20, alignSelf: 'center', textAlign: 'center' },
  input: {
    width: '100%',
    height: 48,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    color: COLORS.text,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});