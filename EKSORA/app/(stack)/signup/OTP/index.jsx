import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { verifyOtp } from '../../../../API/server/AxiosInstance';


const Otp = () => {
  const { email } = useLocalSearchParams(); // ✅ lấy email từ params
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const inputs = [React.useRef(), React.useRef(), React.useRef(), React.useRef()];

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
      await dispatch(verifyOtp({ email, otp: otpValue })).unwrap();

      router.replace({
        pathname: '/(stack)/signup/ResetPassword',
      });
    } catch (error) {
      Alert.alert('Lỗi', error || 'Xác thực OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Feather name="arrow-left" size={20} color="#000" />
        <Text style={styles.headerText}>OTP Request</Text>
      </View>

      {/* Thông báo */}
      <Text style={styles.info}>
        Mã xác thực đã được gửi.{"\n"}
        Vui lòng kiểm tra email:{"\n"}
        <Text style={styles.email}>{email}</Text>
      </Text>

      {/* Ô nhập OTP */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Nút xác thực */}
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Xác thực OTP'}</Text>
      </TouchableOpacity>

      {/* Hỗ trợ */}
      <TouchableOpacity style={styles.supportContainer}>
        <Text style={styles.supportText}>Hỗ trợ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  info: {
    textAlign: 'center',
    marginVertical: 25,
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
  },
  email: {
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
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
