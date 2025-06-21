
import { StyleSheet, View, Image } from 'react-native'
import React, { useEffect } from 'react';
import { COLORS } from '../../../constants/colors';
import { router } from 'expo-router';
import { auth } from '../login/Component/facebooklogin/firebaseConfig';




const  Index = () => {

  useEffect(() => {
    const timer = setTimeout(() => {

      router.push('/(stack)/signup');

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

export default  Index

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
  },
  logo: {
    width: 200,
    height: 200,
  },
})
console.log('Firebase Auth ready:', auth);