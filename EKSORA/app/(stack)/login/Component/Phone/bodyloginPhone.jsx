import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const bodyloginPhone = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Hàm xử lý đăng nhập 
    const handleLogin = () => {
        // Xử lý đăng nhập
        if (!phone || !password) {
            console.log('Vui lòng nhập số điện thoại và mật khẩu');
            return;
        }
        if (phone.length < 10) {
            console.log('Số điện thoại không hợp lệ');
            return;
        }
        if (password.length < 6) {
            console.log('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
       
        // Thực hiện đăng nhập ở đây, ví dụ gọi API
        // reset form
        setPhone('');
        setPassword('');    
        setShowPassword(false);
        console.log('Đăng nhập thành công');
    };

    return (
        <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.inputContainer}>
                <FontAwesome name="phone" size={18} style={styles.icon} />
                <TextInput
                    placeholder="+84  Nhập số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
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

export default bodyloginPhone

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
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
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10
    }
})