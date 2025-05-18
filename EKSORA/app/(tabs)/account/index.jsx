import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import UserInfo from '../../../components/account/UserInfo';


export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản</Text>
      <UserInfo /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     padding: 16, 
     backgroundColor: COLORS.background},
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
});