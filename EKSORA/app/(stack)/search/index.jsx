import React from 'react';
import { StyleSheet, SafeAreaView, View, Platform, StatusBar } from 'react-native';
import HeaderSearch from '../search/Component/headerSearch';
import BodySearch from '../search/Component/bodySearch';

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderSearch />
        <BodySearch />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});