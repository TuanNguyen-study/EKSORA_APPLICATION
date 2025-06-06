import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../../../constants/colors';
import { router } from 'expo-router';


const index = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(stack)/login/homeLogin');
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