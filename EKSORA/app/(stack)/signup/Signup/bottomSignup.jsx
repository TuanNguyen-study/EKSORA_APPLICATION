import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const bottomSignup = () => {

  const router = useRouter();

 return (
    <View>
      <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#0037C1' }]}>
        <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialText}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#FF3D3D' }]}>
        <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialText}>Google</Text>
      </TouchableOpacity>

      <Text style={styles.loginPrompt}>
        Bạn đã có tài khoản? <Text style={styles.loginLink} onPress={()=> router.push('/(stack)/login/loginEmail')}>Đăng nhập</Text>
      </Text>
    </View>
  );
};


export default bottomSignup

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 14,
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {
    marginRight: 10,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginPrompt: {
    textAlign: 'center',
    color: '#AAA',
    marginTop: 30,
  },
  loginLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});