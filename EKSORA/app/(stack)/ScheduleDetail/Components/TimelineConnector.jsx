import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function timelineConnector() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
    </View>
  );    
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginLeft: 50,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#007BFF',
  },
});
