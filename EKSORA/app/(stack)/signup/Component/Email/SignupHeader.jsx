import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SignupHeader(){
  return (
      <Text style={styles.header}>Đăng ký</Text>  
  )
}



const styles = StyleSheet.create({
    header: {
        flex: 0.3,
        fontFamily: 'Roboto',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20,
        color: '#333',
    },

    
})