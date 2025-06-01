import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const bodyloginEmail = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    
    const handleLogin = () => { 
        if (!email || !password) {
            console.log('Vui lòng nhập địa chỉ email và mật khẩu');
            return;
        }
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Địa chỉ email không hợp lệ');
            return;
        }
        if (password.length < 6) {
            console.log('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        // reset form
        setEmail('');
        setPassword('');
        setShowPassword(false);
        console.log('Đăng nhập thành công');
        // Chuyển hướng hoặc hiển thị thông báo thành công
         router.push('/(tabs)/home'); 
        

    }

  return (
       <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={18} style={styles.icon} />
                <TextInput
                    placeholder="Địa chỉ email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
            </View>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={{ color: 'black', textDecorationLine: 'underline', marginTop: 10 }}>
                    Quên mật khẩu
                </Text>
            </TouchableOpacity>
        </View>
  )
}

export default bodyloginEmail

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