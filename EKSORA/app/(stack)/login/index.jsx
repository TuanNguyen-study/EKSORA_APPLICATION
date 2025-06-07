import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { COLORS } from '../../../constants/colors';


const index = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(stack)/signup')
    }, 3000);

    return () => clearTimeout(timer); // Dọn dẹp khi unmount
  }, []);




  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../../../assets/images/Logo.png')}
        style={styles.logo}
      />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
  },
  image: {
    width: 200,
    height: 200,
  },
})