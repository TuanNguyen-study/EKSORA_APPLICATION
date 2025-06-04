import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import Header from './header';
import Body from './body';

export default function UserInfo() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        <Body />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
  },
});