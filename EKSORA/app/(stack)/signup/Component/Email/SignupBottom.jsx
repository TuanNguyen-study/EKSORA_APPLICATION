import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CheckBox from '../../../../../components/CheckBox';

export default function SignupBottom() {
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.bottom}>
      <Text style={styles.separator}>Hoặc đăng nhập bằng</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="google" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButtonGreen}>
          <FontAwesome name="phone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButtonBlue}>
          <FontAwesome name="facebook" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.otherOption}>Lựa chọn khác</Text>

      <View style={styles.checkboxRow}>
        <CheckBox
          checked={isChecked}
          onChange={setChecked}
          label="Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với Điều Khoản Sử Dụng Chung và Chính Sách Bảo Mật của EKSORA"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    padding: 20,
    marginTop: 20,
  },
  separator: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#C4C2C2',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  iconButton: {
    backgroundColor: '#ea4335',
    padding: 10,
    borderRadius: 10,
  },
  iconButtonGreen: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  iconButtonBlue: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 10,
  },
  otherOption: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 20,
  },
  terms: {
    fontSize: 10,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
});
