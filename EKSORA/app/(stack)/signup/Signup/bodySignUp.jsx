import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../../API/services/AxiosInstance';

import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhoneNumber,
  validateRequired,
} from '../../../../utils/validators'; 
const BodySignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  // State để quản lý lỗi cho từng trường
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Hàm xử lý input, định dạng và kiểm tra lỗi tức thì
  const handleInputChange = (field, value) => {
    // Cập nhật giá trị vào form state
    setForm((prev) => ({ ...prev, [field]: value }));

    // Kiểm tra lỗi và cập nhật error state
    let error = null;
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'first_name':
        error = validateName(value, 'Tên');
        break;
      case 'last_name':
        error = validateName(value, 'Họ');
        break;
      case 'phone':
        error = validatePhoneNumber(value);
        break;
      case 'address':
        error = validateRequired(value, 'Địa chỉ');
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Hàm kiểm tra toàn bộ form và thực hiện đăng ký
  const handleRegister = async () => {
    // Kiểm tra tất cả các trường một lần cuối
    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      first_name: validateName(form.first_name, 'Tên'),
      last_name: validateName(form.last_name, 'Họ'),
      phone: validatePhoneNumber(form.phone),
      address: validateRequired(form.address, 'Địa chỉ'),
    };
    
    // Lọc ra những trường có lỗi thực sự
    const validErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v != null));

    if (Object.keys(validErrors).length > 0) {
      setErrors(validErrors); 
      return; 
    }

    setErrors({}); 

    try {
      await dispatch(registerUser(form)).unwrap();
      Alert.alert('Thành công', 'Đăng ký thành công!');
      router.replace('/(tabs)/home');
    } catch (error) {
      let message = 'Đăng ký thất bại. Vui lòng thử lại.';
      if (error?.message) {
        message = typeof error.message === 'string'
          ? error.message
          : error.message.vi || JSON.stringify(error.message);
      }
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <View>
      {/* --- EMAIL --- */}
      <TextInput
        style={[styles.input, errors.email && styles.errorBorder]}
        placeholder="Nhập email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* --- MẬT KHẨU --- */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }, errors.password && styles.errorBorder]}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="#666"
          secureTextEntry={!passwordVisible}
          value={form.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* --- HỌ --- */}
      <TextInput
        style={[styles.input, errors.last_name && styles.errorBorder]}
        placeholder="Nhập họ"
        placeholderTextColor="#666"
        value={form.last_name}
        onChangeText={(text) => handleInputChange('last_name', text)}
      />
      {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}

      {/* --- TÊN --- */}
      <TextInput
        style={[styles.input, errors.first_name && styles.errorBorder]}
        placeholder="Nhập tên"
        placeholderTextColor="#666"
        value={form.first_name}
        onChangeText={(text) => handleInputChange('first_name', text)}
      />
      {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
      
      {/* --- SỐ ĐIỆN THOẠI --- */}
      <TextInput
        style={[styles.input, errors.phone && styles.errorBorder]}
        placeholder="Nhập số điện thoại"
        placeholderTextColor="#666"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text) => handleInputChange('phone', text)}
        maxLength={10}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      {/* --- ĐỊA CHỈ --- */}
      <TextInput
        style={[styles.input, errors.address && styles.errorBorder]}
        placeholder="Nhập địa chỉ"
        placeholderTextColor="#666"
        value={form.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

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
    marginTop: 12, 
  },
  button: {
    backgroundColor: '#008CDB',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20, 
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20, 
    marginTop: 4,
  },
});