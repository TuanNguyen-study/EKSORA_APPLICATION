import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function bodyLoginEmail() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

            <TouchableOpacity style={styles.button}>
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