import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../../../API/helpers/AxiosInstance';
import { FontAwesome} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

function BodyLoginEmail() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
  
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
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
            <View style={styles.inputContainer}>
    <FontAwesome name="envelope" size={18} style={styles.icon} />
    <TextInput
        placeholder="Địa chỉ email"
        value={form.email}
        onChangeText={text => setForm({ ...form, email: text })}
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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/(stack)/login/Component/OTP_Password/SendOTP_Screern')}>
                <Text style={{ color: 'black', textDecorationLine: 'underline', marginTop: 10 }}>
                    Quên mật khẩu
                </Text>
            </TouchableOpacity>
        </View>
  )
}

export default BodyLoginEmail

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginVertical: 10,
        paddingHorizontal: 10
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        height: 45
    },
    button: {
        backgroundColor: '#0079C1',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    }

})