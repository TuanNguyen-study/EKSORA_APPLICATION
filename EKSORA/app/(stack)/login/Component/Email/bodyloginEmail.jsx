import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BodyLoginEmail = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        if (!email || !password) {
            console.log('Vui lòng nhập địa chỉ email và mật khẩu');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Địa chỉ email không hợp lệ');
            return;
        }

        if (password.length < 6) {
            console.log('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        // Reset form
        setEmail('');
        setPassword('');
        setShowPassword(false);
        console.log('Đăng nhập thành công');

        // Chuyển sang trang chính
        router.push('/(tabs)/home');
    };

    return (
        <View style={styles.container}>
            {/* Email input */}
            <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={18} style={styles.icon} />
                <TextInput
                    placeholder="Địa chỉ email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
            </View>

            {/* Password input */}
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

            {/* Login button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* Quên mật khẩu / Đăng ký */}
            <View style={styles.row}>
                <TouchableOpacity onPress={() => router.push('/(stack)/signup/Repassword')}>
                    <Text style={styles.bold}>Quên mật khẩu</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(stack)/signup')}>
                    <Text style={styles.link}>Chưa có tài khoản? <Text style={styles.bold}>Đăng ký</Text></Text>
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
});
