
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../../hooks/toastConfig'; // Thay bằng đường dẫn thực tế đến toastConfig
import BodyloginEmail from '../Component/Emailorphone/bodyloginEmailorphone';
import BottomloginEmail from '../Component/Emailorphone/bottomloginEmailorphone';


const LoginEmailScreen = () => {
    const { redirectTo } = useLocalSearchParams();
    return (
        <View style={styles.container1}>
            <Text style={styles.header}>Đăng nhập</Text>

            <BodyloginEmail />
            <BottomloginEmail />
            <Toast config={toastConfig} />

        </View>
    );
};


export default LoginEmailScreen


const styles = StyleSheet.create({
    container1: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        flexGrow: 1,
        justifyContent: 'center',
        marginBottom: 30,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        marginBottom: 35,
    },  
});