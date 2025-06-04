import { router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>

      <View style={styles.inputContainer}>
        <Feather name="mail" size={18} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ email"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(stack)/signup/OTP')}>
        <Text style={styles.buttonText}>Xác Thực</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportContainer}>
        <Text style={styles.supportText}>Hỗ trợ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;

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
    marginBottom: 20,
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  supportContainer: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  supportText: {
    textDecorationLine: 'underline',
    color: '#000',
  },
});
