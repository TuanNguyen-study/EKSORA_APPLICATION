import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function bodyPhone() {
    return (
        <View>
            <TextInput style={styles.input} 
            placeholder="+84   Nhập số điện thoại"
             keyboardType="phone-pad" />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.link}>Đăng nhập bằng mật khẩu</Text>
            </TouchableOpacity>
        </View>
    )
}



const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 30,
        padding: 12,
        marginBottom: 12,
        borderColor: '#ccc',
         width: 367,
        height: 52,
    },
    button: {
        backgroundColor: '#005ea6',
        padding: 14,
        borderRadius: 30,
        width: 367,
        height: 52,
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        color: '#000',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginBottom: 25,
    },
})