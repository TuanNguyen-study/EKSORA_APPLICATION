import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BodySignUp from '../signup/Components/Signup/bodySignUp'
import BottomSignUp from '../signup/Components/Signup/bottomSignup'

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng nhập/Đăng ký</Text>
      <BodySignUp/>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Hoặc đăng ký bằng</Text>
        <View style={styles.line} />
      </View>
      <BottomSignUp />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop:10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: '#000',
  },
});