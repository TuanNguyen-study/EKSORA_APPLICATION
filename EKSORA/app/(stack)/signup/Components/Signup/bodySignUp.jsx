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
  const [errors, setErrors] = useState({});


 const handleRegister = async () => {
  let newErrors = {};

  if (!form.email.trim()) newErrors.email = 'Email không được để trống';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.email && !emailRegex.test(form.email)) {
    newErrors.email = 'Email không hợp lệ';
  }

  if (!form.password.trim()) newErrors.password = 'Mật khẩu không được để trống';
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (form.password && !passwordRegex.test(form.password)) {
    newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt';
  }

  if (!form.first_name.trim()) newErrors.first_name = 'Vui lòng nhập tên';
  if (!form.last_name.trim()) newErrors.last_name = 'Vui lòng nhập họ';
  if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';

  const phoneRegex = /^0\d{9}$/;
  if (!form.phone.trim()) {
    newErrors.phone = 'Số điện thoại không được để trống';
  } else if (!phoneRegex.test(form.phone)) {
    newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({}); 

  try {
    await dispatch(registerUser(form)).unwrap();
    Alert.alert('Thành công', 'Đăng ký thành công!');
    router.replace('/(tabs)/home');
  } catch (error) {
    let message = 'Đăng ký thất bại';
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
      <TextInput
         style={[styles.input, errors.email && styles.errorBorder]}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={text => setForm(prev => ({ ...prev, email: text }))}
      />


      <View style={styles.passwordContainer }>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }, errors.password&& styles.errorBorder]}
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
        style={[styles.input, errors.first_name && styles.errorBorder]}
        placeholder="First Name"
        value={form.first_name}
        onChangeText={text => setForm(prev => ({ ...prev, first_name: text }))}
      />
      <TextInput
      style={[styles.input, errors.last_name && styles.errorBorder]}
        placeholder="Last Name"
        value={form.last_name}
        onChangeText={text => setForm(prev => ({ ...prev, last_name: text }))}
      />
      <TextInput
        style={[styles.input, errors.phone && styles.errorBorder]}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={text => setForm(prev => ({ ...prev, phone: text }))}
      />
      <TextInput
          style={[styles.input, errors.address && styles.errorBorder]}
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

  errorBorder: {
  borderColor: 'red',
},

});