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
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#007BFF',
    marginBottom: 4,
  },
});
