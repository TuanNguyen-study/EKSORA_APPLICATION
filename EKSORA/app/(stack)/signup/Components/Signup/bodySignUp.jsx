import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { registerUser  } from '../../../../../API/helpers/AxiosInstance';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';


const BodySignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = async () => {
    if (Object.values(form).some(value => value.trim() === '')) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt');
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải bắt đầu bằng số 0 và đủ 10 số');
      return;
    }

    try {
     await dispatch(registerUser(form)).unwrap();
      Alert.alert('Thành công', 'Đăng ký thành công!');
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Đăng ký thất bại', error.toString());
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={text => setForm(prev => ({ ...prev, email: text }))}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={form.password}
          onChangeText={text => setForm(prev => ({ ...prev, password: text }))}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.first_name}
        onChangeText={text => setForm(prev => ({ ...prev, first_name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.last_name}
        onChangeText={text => setForm(prev => ({ ...prev, last_name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={text => setForm(prev => ({ ...prev, phone: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={text => setForm(prev => ({ ...prev, address: text }))}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BodySignUp;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#008CDB',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 12,
  },
});
