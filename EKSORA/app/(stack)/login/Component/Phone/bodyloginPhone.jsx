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
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    const { phone, password } = form;

    if (!phone || !password) {
      Alert.alert('Lỗi', 'vui lòng nhập  đày đủ số điện thoại và mật khẩu');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('Lỗi', 'số điện thoại không hợp lệ');
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
      <View style={styles.inputContainer}>
        <FontAwesome name="phone" size={18} style={styles.icon} />
        <TextInput
          placeholder="+84  Nhập số điện thoại"
          value={form.phone}
          onChangeText={text => setForm({ ...form, phone: text })}
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={18} style={styles.icon} />
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={form.password}
          onChangeText={text => setForm({ ...form, password: text })}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={{ color: 'black', textDecorationLine: 'underline', marginTop: 10 }}>
          Quên mật khẩu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BodyLoginPhone;

const styles = StyleSheet.create({

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',

    borderRadius: 30,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
  },
  button: {
    backgroundColor: '#0079C1',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
   
  loginButton: {
    backgroundColor: '#009DFF',
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 10, },

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
    textDecorationLine:'underline'

  },
  bold: {
    fontWeight: 'bold',
    textDecorationLine:'underline'
  },
  }
});
