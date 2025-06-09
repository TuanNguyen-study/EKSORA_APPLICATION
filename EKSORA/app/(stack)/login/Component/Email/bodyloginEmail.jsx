import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../../../API/helpers/AxiosInstance';
import { FontAwesome} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

function BodyLoginEmail() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    let hasError = false;

    if (!form.email.trim()) { setEmailError(true); hasError = true;
    } else {
      setEmailError(false);
    }

    if (!form.password.trim()) {setPasswordError(true); hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError(true);
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    } else {
      setEmailError(false);
    }

    try {
      setLoading(true);
      await dispatch(loginUser(form)).unwrap();
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      router.push('/(tabs)/home');
    } catch (error) {
      console.log('Đăng nhập lỗi:', error, error?.response?.data);
      Alert.alert('Đăng nhập thất bại', error?.response?.data?.message || error?.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={[styles.inputContainer, emailError && styles.errorBorder]}>
        <FontAwesome name="envelope" size={18} style={styles.icon} />
        <TextInput
          placeholder="Địa chỉ email"
          value={form.email}
          onChangeText={text => {
            setForm({ ...form, email: text });
            if (emailError) setEmailError(false);
          }}
          style={styles.input}
        />
      </View>

      <View style={[styles.inputContainer, passwordError && styles.errorBorder]}>
        <FontAwesome name="lock" size={18} style={styles.icon} />
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={form.password}
          onChangeText={text => {
            setForm({ ...form, password: text });
            if (passwordError) setPasswordError(false);
          }}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} />
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.replace('/(stack)/signup/Repassword')}>
          <Text style={styles.link}>Quên mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(stack)/signup')}>
          <Text style={styles.link}>
            Chưa có tài khoản? <Text style={styles.bold}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 15,
  },
  errorBorder: {
    borderColor: 'red',
  },
  icon: {
    marginRight: 10,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#009DFF',
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 4,
  },
  link: {
    color: '#000',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
