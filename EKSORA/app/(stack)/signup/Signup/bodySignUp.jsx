import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const bodySignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
          
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
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

            <TextInput style={styles.input} placeholder="First Name" />
            <TextInput style={styles.input} placeholder="Last Name" />
            <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
};


export default bodySignUp

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
});