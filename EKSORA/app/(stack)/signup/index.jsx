import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView, StatusBar } from 'react-native';
import { ScrollView } from 'react-native';
// import SignupHeader from './Component/Email/SignupHeader';
// import SignupBottom from './Component/Email/SignupBottom';
// import SignupBody from './Component/Email/SignupBody';
import BodyPhone from './Component/Phone/bodyPhone';
import BottomPhone from './Component/Phone/bottomPhone';
import HeaderPhone from './Component/Phone/hearderPhone';


export default function index() {
  const onsubmit = (data) => {
    console.log(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container1}>
        <HeaderPhone />
        <BodyPhone onsubmit={onsubmit} />
        <BottomPhone />
        {/* <SignupHeader />
        <SignupBody onsubmit={onsubmit} />
        <SignupBottom />
         */}
      </ScrollView>
    </SafeAreaView>
  );
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