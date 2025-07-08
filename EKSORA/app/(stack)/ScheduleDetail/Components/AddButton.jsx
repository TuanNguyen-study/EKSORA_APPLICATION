  import { router } from 'expo-router';
import React from 'react';
  import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

  export default function AddButton() {
    return (
      <TouchableOpacity style={styles.button} onPress={() => {
          Alert.alert('Thành công', 'Bạn đã bắt đầu đi theo lịch trình ');
          router.replace('/(tabs)/home'); 
      }}>
        <Text style={styles.text}>Bắt đầu theo lịch trình</Text>
      </TouchableOpacity>
    );
  }

  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#FF3366',
      margin: 16,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    text: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
