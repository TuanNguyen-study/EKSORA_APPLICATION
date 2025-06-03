import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const BodyLoginPhone = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (!phone || !password) {
      console.log('Vui lòng nhập số điện thoại và mật khẩu');
      return;
    }
    if (phone.length < 9) {
      console.log('Số điện thoại không hợp lệ');
      return;
    }
    if (password.length < 6) {
      console.log('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // reset form
    setPhone('');
    setPassword('');
    setShowPassword(false);
    console.log('Đăng nhập thành công');

    router.push('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      {/* Số điện thoại */}
      <View style={styles.inputContainer}>
        <FontAwesome name="phone" size={18} style={styles.icon} />
        <TextInput
          placeholder="+84  Nhập số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      {/* Mật khẩu */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={18} style={styles.icon} />
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} />
        </TouchableOpacity>
      </View>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Dòng dưới nút */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.bold}>Quên mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(stack)/signup')}>
          <Text style={styles.link}>Chưa có tài khoản? <Text style={styles.bold}>Đăng ký</Text></Text>
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
    textDecorationLine:'underline'

  },
  bold: {
    fontWeight: 'bold',
    textDecorationLine:'underline'
  },
});
