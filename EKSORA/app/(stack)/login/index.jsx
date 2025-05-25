import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native';
import BodyLoginEmail from './email/bodyLoginEmail';
// import BottomLoginEmail from './Component/email/bottomLoginEmail';


export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.header}>Đăng nhập</Text>
        <BodyLoginEmail />
        {/* <BottomLoginEmail /> */}
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container1: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
})