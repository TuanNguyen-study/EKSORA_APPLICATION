import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '../../../../../components/CheckBox'; 

const BottomLoginPhone = () => {
  const [isChecked, setChecked] = useState(false); 

  return (
    <View style={styles.bottom}>
      {/* Dòng kẻ với chữ ở giữa */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.line} />
      </View>

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
        />
         <Text style={styles.terms}> Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với Điều Khoản Sử Dụng Chung và Chính Sách Bảo Mật của EKSORA</Text>
      </View>
    </View>
  );
};

export default BottomLoginPhone;

const styles = StyleSheet.create({
  bottom: {
    padding: 20,
    marginTop: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#C4C2C2',
  },
  orText: {
    marginHorizontal: 8,
    color: '#C4C2C2',
    fontWeight: 'bold',
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
    flexWrap: 'wrap',  // Cho phép text xuống dòng
  },
  terms: {
    fontSize: 10,
    color: '#444',
    marginLeft: 8,
    flex: 1,
  },
});
