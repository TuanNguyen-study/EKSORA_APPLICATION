import { FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Body from '../../../components/favorites/Component/body';
import Header from '../../../components/favorites/Component/header';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Header />
        <Body />
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#f6fafd',
  },
});