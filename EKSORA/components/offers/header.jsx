import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ưu đãi</Text>
      <Image source={require('../../assets/images/percent.png')} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005bac',
  },
  icon: {
    width: 40,
    height: 40,
  },
});