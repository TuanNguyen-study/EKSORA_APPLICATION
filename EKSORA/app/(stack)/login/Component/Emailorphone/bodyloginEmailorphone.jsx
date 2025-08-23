import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

import { loginUser } from '../../../../../API/services/AxiosInstance';
import { useVoucher } from '../../../../../store/VoucherContext';

import { clearRedirectPath, logout } from '../../../../../API/services/authSlice';



function BodyLoginEmail() {
  // State quản lý form input
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  // State quản lý các lỗi của form
  const [errors, setErrors] = useState({ emailOrPhone: '', password: '' });

  // State quản lý trạng thái loading
  const [isLoading, setIsLoading] = useState(false);
  // State quản lý việc hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);
   const [phoneError, setPhoneError] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams();

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
    const newErrors = { emailOrPhone: '', password: '' };
    let isValid = true;

    // Kiểm tra email hoặc số điện thoại
    if (!form.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Vui lòng nhập email hoặc số điện thoại';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,12}$/;
      if (!emailRegex.test(form.emailOrPhone.trim()) && !phoneRegex.test(form.emailOrPhone.trim())) {
        newErrors.emailOrPhone = 'Email hoặc số điện thoại không hợp lệ';
        isValid = false;
      }
    }

    // Kiểm tra mật khẩu
    if (!form.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Thêm delay nhỏ để tránh submit quá nhanh
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await dispatch(loginUser(form)).unwrap();
      
      if (!response || !response.token) {
        throw new Error('Invalid login response');
      }

      // Fetch promotions sau khi đăng nhập thành công
      await fetchPromotions();
      dispatch(clearRedirectPath());

      // Xử lý chuyển hướng
      let targetRoute = '/(tabs)/home';
      if (redirectTo && typeof redirectTo === 'string') {
        if (redirectTo.includes('bookings')) {
          targetRoute = '/(tabs)/trips';
        } else if (redirectTo.includes('trip-detail')) {
          targetRoute = redirectTo;
        } else if (redirectTo === '/(stack)/acount/settingScreen') {
          targetRoute = '/(tabs)/account';
        } else if (redirectTo === '/(tabs)/favorites') {
          targetRoute = '/(tabs)/favorites';
        } else {
          // Sử dụng redirectTo trực tiếp nếu nó là một route hợp lệ
          targetRoute = redirectTo;
        }
      }
      
      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công',
        text2: 'Chào mừng bạn quay trở lại!'
      });

      router.replace(targetRoute);

    } catch (error) {
      console.error('Login error:', error);
      
      // Hiển thị thông báo lỗi cụ thể
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: error?.message || 'Vui lòng kiểm tra lại thông tin đăng nhập'
      });

      // Clear form nếu có lỗi xác thực
      if (error?.message?.includes('không chính xác')) {
        setForm(prev => ({ ...prev, password: '' }));
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Email hoặc Số điện thoại */}
      <View style={[styles.inputContainer, !!errors.emailOrPhone && styles.errorBorder]}>
        <FontAwesome name="envelope" size={18} style={styles.icon} />
        <TextInput
          placeholder="Email hoặc số điện thoại"
          placeholderTextColor="#666"
          value={form.emailOrPhone}
          onChangeText={(text) => handleInputChange('emailOrPhone', text)}
          style={styles.input}
          keyboardType="default"
          autoCapitalize="none"
          autoComplete="off"
          textContentType="username"
        />
      </View>
      {!!errors.emailOrPhone && <Text style={styles.errorText}>{errors.emailOrPhone}</Text>}

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
          autoComplete="password"
          textContentType="password"
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <FontAwesome 
            name={showPassword ? 'eye-slash' : 'eye'} 
            size={18} 
            style={styles.icon} 
          />
        </TouchableOpacity>
      </View>
      {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Nút Đăng nhập */}
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
        accessibilityLabel="Đăng nhập"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      {/* Các liên kết khác */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.replace('/(stack)/signup/Repassword')}>
          <Text style={styles.link}>Quên mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(stack)/signup')}>
          <Text style={styles.link}>
            Chưa có tài khoản? <Text style={styles.bold}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    backgroundColor: '#2a6ee4ff',
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
    color: '#2a6ee4ff',
  },
});