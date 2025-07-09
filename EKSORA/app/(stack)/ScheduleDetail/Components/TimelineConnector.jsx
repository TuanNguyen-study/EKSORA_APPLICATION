import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TimelineConnector({ distance, duration }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Ionicons name="car" size={20} color="#007BFF" />
      <Text style={styles.text}>{distance} | {duration}</Text>
    </View>
  );    
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: '#007BFF',
    marginBottom: 4,
  },
  text: {
    color: 'gray',
    fontSize: 12,
  },
});
