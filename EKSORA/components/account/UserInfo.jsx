import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function UserInfo() {
  return (
    <View style={styles.info}>
      <Text style={styles.name}>Tên: Nguyễn Văn A</Text>
      <Text style={styles.email}>Email: nguyen.vana@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: { backgroundColor: COLORS.white, borderRadius: 10, padding: 16 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  email: { fontSize: 14, color: COLORS.text, marginTop: 5 },
});