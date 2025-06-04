import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Nhập lại mật khẩu</Text>

      {/* Mật khẩu */}
      <View style={styles.inputContainer}>
        <Feather name="lock" size={18} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Nhập lại mật khẩu */}
      <View style={styles.inputContainer}>
        <Feather name="lock" size={18} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry={!showRePassword}
          value={rePassword}
          onChangeText={setRePassword}
        />
        <TouchableOpacity onPress={() => setShowRePassword(!showRePassword)}>
          <Feather name={showRePassword ? 'eye-off' : 'eye'} size={18} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Nút đổi mật khẩu */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(stack)/login/loginEmail')}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 30,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0086CD',
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
