import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { loginphone } from '../../../../../API/helpers/AxiosInstance';
import { useDispatch } from 'react-redux';

const BodyLoginPhone = () => {

  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    const { phone, password } = form;
    let hasError = false;

    if (!phone) {
      setPhoneError(true);
      hasError = true;
    } else if (phone.length < 10) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      Alert.alert('Lỗi', 'vui lòng nhập đầy đủ số điện thoại và mật khẩu hợp lệ');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert('Lỗi', 'đật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt');
      return;
    }

    setLoading(true);
    try {
      const resultAction = await dispatch(loginphone({ phone, password }));
      if (loginphone.fulfilled.match(resultAction)) {
        Alert.alert('Thành công', 'đăng nhập thành công!');
        setForm({ phone: '', password: '' });
        setShowPassword(false);
        router.push('/(tabs)/home');
      } else {
        Alert.alert('thất bại', resultAction.payload || 'đăng nhập thất bại');
      }
    } catch (err) {
      Alert.alert('lỗi hệ thống', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={[styles.inputContainer, phoneError && styles.errorBorder]}>
        <FontAwesome name="phone" size={18} style={styles.icon} />
        <TextInput
          placeholder="+84  Nhập số điện thoại"
          value={form.phone}
          onChangeText={text => {
            setForm({ ...form, phone: text });
            if (phoneError) setPhoneError(false);
          }}
          keyboardType="phone-pad"
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

export default BodyLoginPhone;

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
        textDecorationLine: 'underline'

    },
    bold: {
        fontWeight: 'bold',
        textDecorationLine: 'underline'

    },

    errorBorder: {
  borderColor: 'red',
},

});