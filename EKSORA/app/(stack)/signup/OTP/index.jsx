import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1].focus();
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
        The verification code has been sent.{"\n"}
        Check the code on your email{"\n"}
        sent to <Text style={styles.email}>claudiaalves@mail.com</Text>
      </Text>

      {/* Ô nhập OTP */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Nút xác thực */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(stack)/signup/ResetPassword')}>
        <Text style={styles.buttonText}>Xác thực OTP</Text>
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
