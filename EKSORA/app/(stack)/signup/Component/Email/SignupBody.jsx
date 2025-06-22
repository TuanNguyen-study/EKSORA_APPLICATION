import { View, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native';
import { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react'

export default function SignupBody({ onSubmit }) {
    const [email, setEmail] = useState('');


    return (
        <View>
            <View style={styles.inputWrapper}>
                <Entypo name="mail" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => onSubmit({ email })}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.link}>Đăng nhập bằng mật khẩu</Text>
            </TouchableOpacity>
        </View>
    )
}



const styles = StyleSheet.create({

    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: 367,
        height: 52,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        width: 367,
        height: 52,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    button: {
        backgroundColor: '#0066A2',
        borderRadius: 8,
        paddingVertical: 12,
        borderRadius: 30,
        width: 367,
        height: 52,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',

    },
    link: {
        color: '#000',
        textDecorationLine: 'underline',
        marginTop: 30,
        marginBottom: 25,
    },
})