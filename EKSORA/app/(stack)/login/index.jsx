import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BodyLogin from './Component/homeLogin/BodyLogin';
import BottonLogin from './Component/homeLogin/BottonLogin';


export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
                <Text style={styles.header}>Đăng nhập</Text>
        <BodyLogin />
        <BottonLogin />
        {/* <BodyloginPhone />
        <BottomloginPhone /> */}
        {/* <BodyloginEmail />
        <BottomloginEmail /> */}
            </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 35,
  },  

  container1: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 30,
  },
})