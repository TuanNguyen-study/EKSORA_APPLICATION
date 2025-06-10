import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet,  Alert, Platform ,Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '../../../../../components/CheckBox';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../../login/Component/facebooklogin/firebaseConfig';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import useGoogleLogin from '../../../login/Component/googleLogin/GoogleLoginButton';



const BottomLoginEmail = () => {

  const [isChecked, setChecked] = useState(false);
  const router = useRouter();
    // Thiết lập Google Auth Request
 const { promptAsync: googleLogin, request: googleRequest } = useGoogleLogin();
    // Thiết lập Facebook Auth Request cho mobile
  const [request, response, promptAsync] = Facebook.useAuthRequest({
          clientId: "714285671096257",
      });
  
      // Xử lý phản hồi từ Facebook trên mobile
      useEffect(() => {
          if (response?.type === "success") {
              const accessToken = 
                  response.authentication?.accessToken || response.authentication?.access_token;
              
              if (!accessToken) {
                  console.error("Không lấy được token");
                  Alert.alert("Lỗi", "Không lấy được token Facebook");
                  return;
              }
              
              const credential = FacebookAuthProvider.credential(accessToken);
              signInWithCredential(auth, credential)
                  .then(() => {
                      Alert.alert("Thành công", "Đăng nhập Facebook thành công!");
                      router.replace("/(tabs)/home");
                  })
                  .catch((error) => {
                      console.error("Lỗi đăng nhập Firebase:", error);
                      Alert.alert("Lỗi", `Đăng nhập thất bại: ${error.message}`);
                  });
          }
      }, [response]);
  
      // Hàm xử lý đăng nhập Facebook
      const handleFacebookLogin = async () => {
          try {
              if (Platform.OS === 'web') {
                  // Sử dụng phương thức web
                // await loginWithFacebook();
                    const result = await promptAsync();
                if (result?.type === 'success') {
                  router.replace("/(tabs)/home"); 
                } else {
                  console.log("đăng nhập Facebook.");
                }
              } else {

                promptAsync();
              }
          } catch (error) {
              console.error("Lỗi đăng nhập Facebook:", error);
              Alert.alert("Lỗi", `Đăng nhập thất bại: ${error.message}`);
          } 
      };

      // Hàm xử lý đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      if (result?.type !== 'success') {
        console.log("Người dùng huỷ đăng nhập Google");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      Alert.alert("Lỗi", "Đăng nhập Google thất bại");
    }
  };

  return (
    <View style={styles.bottom}>
      {/* Dòng kẻ với chữ ở giữa */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleGoogleLogin} disabled={!googleRequest}>
          <FontAwesome name="google" size={24} color="white"  />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButtonGreen} onPress={() => router.push('/(stack)/login/loginPhone')}>  
          <FontAwesome name="phone" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButtonBlue} onPress={handleFacebookLogin}>
          <FontAwesome name="facebook" size={24} color="white"/>
        </TouchableOpacity>
      </View>

      <Text style={styles.otherOption}>Lựa chọn khác</Text>

       <View style={styles.checkboxRow}>
        <CheckBox
          checked={isChecked}
          onChange={setChecked}
        />

        <Text style={styles.terms}>
          Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với Điều Khoản Sử Dụng Chung và Chính Sách Bảo Mật của EKSORA
        </Text>

     
      </View>
    </View>
  );
};

export default BottomLoginEmail;


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
    flexWrap: 'wrap',  // Cho phép text xuống dòng
  },
  terms: {
    fontSize: 10,
    color: '#444',
    marginLeft: 8,
    flex: 1,
  },
})