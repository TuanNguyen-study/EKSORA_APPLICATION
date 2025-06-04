import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../../../../constants/colors';
import { useRouter } from 'expo-router';

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (text, idx) => {
    if (!/^\d*$/.test(text)) return; // chỉ cho nhập số
    const newOtp = [...otp];
    newOtp[idx] = text;
    setOtp(newOtp);
    if (text && idx < 3) {
      inputs[idx + 1].current.focus();
    }
    if (!text && idx > 0) {
      inputs[idx - 1].current.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 4 số OTP');
      return;
    }
    try {
      setLoading(true);
      // TODO: Gọi API xác thực OTP ở đây
      Alert.alert('Thành công', 'Xác thực OTP thành công!');
      router.replace('/(stack)/login/Component/OTP_Password/update_paswor');
    } catch (error) {
      Alert.alert('Lỗi', error?.response?.data?.message || error?.message || 'Xác thực OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <Text style={styles.subtitle}>Vui lòng nhập mã OTP đã gửi về email hoặc số điện thoại của bạn</Text>
      <View style={styles.otpRow}>
        {otp.map((value, idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={text => handleChange(text, idx)}
            autoFocus={idx === 0}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang xác thực...' : 'Xác nhận'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, alignSelf: 'center' },
  subtitle: { fontSize: 16, color: COLORS.text, marginBottom: 20, alignSelf: 'center', textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  input: {
    width: 48,
    height: 48,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#f9f9f9',
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 24,
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