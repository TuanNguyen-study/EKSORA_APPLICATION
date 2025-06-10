import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import UserInfo from '../../../components/account/UserInfo';


export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <UserInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

});