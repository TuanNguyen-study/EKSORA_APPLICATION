import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';

import { loginUser } from '../../../../../API/services/AxiosInstance';
import { useVoucher } from '../../../../../store/VoucherContext';
import Toast from 'react-native-toast-message';

function BodyLoginEmail() {
  // State quản lý form input
  const [form, setForm] = useState({ email: '', password: '' });
  // State quản lý các lỗi của form
  const [errors, setErrors] = useState({ email: '', password: '' });
  // State quản lý trạng thái loading
  const [isLoading, setIsLoading] = useState(false);
  // State quản lý việc hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  
  // Lấy hàm fetchPromotions từ VoucherContext
  const { fetchPromotions } = useVoucher();

  // Hàm xử lý khi người dùng thay đổi text input
  const handleInputChange = (field, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [field]: value,
    }));
    // Khi người dùng bắt đầu nhập, xóa thông báo lỗi của trường đó
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  // Hàm kiểm tra dữ liệu form
  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // Kiểm tra email
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Địa chỉ email không hợp lệ';
        isValid = false;
      }
    }

    // Kiểm tra mật khẩu
    if (!form.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (isLoading) return;

    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await dispatch(loginUser(form)).unwrap();
      await fetchPromotions();

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đăng nhập thành công!',
      });

      setTimeout(() => {
        router.replace('/(tabs)/home'); 
      }, 1500);

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: error?.message || 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Email */}
      <View style={[styles.inputContainer, !!errors.email && styles.errorBorder]}>
        <FontAwesome name="envelope" size={18} style={styles.icon} />
        <TextInput
          placeholder="Địa chỉ email"
          placeholderTextColor="#666"
          value={form.email}
          onChangeText={(text) => handleInputChange('email', text)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Input Mật khẩu */}
      <View style={[styles.inputContainer, !!errors.password && styles.errorBorder]}>
        <FontAwesome name="lock" size={18} style={styles.icon} />
        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={form.password}
          onChangeText={(text) => handleInputChange('password', text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Nút Đăng nhập */}
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      {/* Các liên kết khác */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push('/(stack)/signup/Repassword')}>
          <Text style={styles.link}>Quên mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(stack)/signup')}>
          <Text style={styles.link}>
            Chưa có tài khoản? <Text style={styles.bold}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

export default BodyLoginEmail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 15,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
  icon: {
    marginRight: 10,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#009DFF',
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 25,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  link: {
    color: '#000',
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
    color: '#009DFF',
  },
});
