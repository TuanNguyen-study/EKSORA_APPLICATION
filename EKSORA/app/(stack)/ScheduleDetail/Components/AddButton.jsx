  import { router } from 'expo-router';
import React from 'react';
  import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

  export default function AddButton() {
    return (
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Thêm địa điểm </Text>
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
