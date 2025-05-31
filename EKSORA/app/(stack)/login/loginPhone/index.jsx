import { StyleSheet, View, Text } from 'react-native';
import BodyloginPhone from '../Component/Phone/bodyloginPhone';
import BottomloginPhone from '../Component/Phone/bottomloginPhone';

const index = () => {
    return (
        <View style={styles.container1}>
            <Text style={styles.header}>Đăng nhập</Text>
            <BodyloginPhone />
            <BottomloginPhone />
        </View>
    )
}

export default index

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

})