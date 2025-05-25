import { StyleSheet, Text } from 'react-native';

export default function headerLoginEmail() {
    return (
       <Text style={styles.header}>Đăng nhập</Text>
        
    )
}


const styles = StyleSheet.create({
     header: {
        flex: 0.3,
        fontFamily: 'Roboto',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20,
        color: '#333',
        marginBottom: 20,
    },

})