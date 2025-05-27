import { StyleSheet, Text, View } from 'react-native'
import BodyloginEmail from '../Component/Email/bodyloginEmail'
import BottomloginEmail from '../Component/Email/bottomloginEmail'

const index = () => {
    return (
        <View style={styles.container1}>
            <Text style={styles.header}>Đăng nhập</Text>
            <BodyloginEmail />
            <BottomloginEmail />
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