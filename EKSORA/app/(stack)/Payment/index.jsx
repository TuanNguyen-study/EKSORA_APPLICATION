import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Body from '../Payment/Components/bodyPayment';
import Header from '../Payment/Components/headerPayment';

const index = () => {
  return (
       <ScrollView style={styles.container}>
      <Header />
      <Body />
    </ScrollView>
  );
}

export default index;


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    flex: 1,
  },
});
