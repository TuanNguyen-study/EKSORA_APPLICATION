import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../../../API/helpers/AxiosInstance'; // Cập nhật đúng đường dẫn nếu cần

const ResetPassword = () => {
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

const handleResetPassword = async () => {
  if (!password) {
    Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
    return;
  }

  try {
 await dispatch(resetPassword({ newPassword: password, resetToken: token })).unwrap();

    Alert.alert('Thành công', 'Đổi mật khẩu thành công');
    router.push('/(stack)/login/loginEmail');
  } catch (error) {
    console.error('Reset password error:', error);

    let message = 'Đổi mật khẩu thất bại';

    try {
      if (typeof error === 'string') {
        message = error;
      } else if (typeof error?.message === 'string') {
        message = error.message;
      } else if (typeof error?.message === 'object') {
        message = JSON.stringify(error.message);
      } else if (typeof error === 'object') {
        message = JSON.stringify(error);
      }
    } catch (err) {
      message = 'Lỗi không xác định';
    }

    Alert.alert('Lỗi', message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập lại mật khẩu</Text>

      <View style={styles.inputContainer}>
        <Feather name="lock" size={18} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          autoComplete="password"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#555" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

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
    marginBottom: 15,
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
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
