import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView, StatusBar } from 'react-native';
import { ScrollView } from 'react-native';
import BodyPhone from '../Component/Phone/bodyPhone';
import BottomPhone from '../Component/Phone/bottomPhone';
import HeaderPhone from '../Component/Phone/hearderPhone';

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