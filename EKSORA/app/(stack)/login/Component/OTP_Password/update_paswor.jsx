import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../../../../constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '../../../../../API/helpers/AxiosInstance';

export default function UpdatePasswordScreen() {
const [form, setForm] = useState({
  currentPassword: '',
  password: '',
  confirmPassword: '',
});



  const dispatch = useDispatch();
  const router = useRouter();

  const handleUpdatePassword = async () => {
    if (!form.password || !form. currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (form.password !== form. currentPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận không khớp');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt');
      return;
    }

    try {
      await dispatch(
        resetPassword({  currentPassword: form.password })
      ).unwrap();
      Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
      router.replace('/(stack)/login/loginEmail/index');
    } catch (error) {
      Alert.alert('Thất bại', error?.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, currentPassword: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    alignSelf: 'center',
  },
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
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
