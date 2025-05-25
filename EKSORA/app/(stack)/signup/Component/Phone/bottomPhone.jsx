import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, CheckBox } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


export default function bottomPhone() {
  const [agree, setAgree] = React.useState(false);
  const [isChecked, setChecked] = React.useState(false);

  return (
    <View style={styles.bottom}>
      <Text style={styles.separator}>Hoặc đăng nhập bằng</Text>
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="google" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButtonGray}>
          <FontAwesome name="envelope" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButtonBlue}>
          <FontAwesome name="facebook" size={24} color="white" style={styles.icon} />
        </TouchableOpacity> 
      </View>

      
      <Text style={styles.otherOption}>Lựa chọn khác</Text> 


      <View style={styles.checkboxRow}>
       <CheckBox value={isChecked} onValueChange={setChecked} style={styles.checkboxRow} />
      <Text style={styles.terms}>
        Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với Điều Khoản Sử Dụng Chung và Chính Sách Bảo Mật của EKSORA
      </Text>
      </View>
    </View>
  )
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
  iconButtonGray: {
    backgroundColor: '#999',
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
    color: "black",
    textDecorationLine: 'underline',
    marginTop: 200,
  },

  icon: {
    width: 60,
    height: 24,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
})