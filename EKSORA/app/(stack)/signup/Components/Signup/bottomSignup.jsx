import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { View,Alert, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../../login/Component/facebooklogin/firebaseConfig';
import * as Facebook from 'expo-auth-session/providers/facebook';
import useGoogleLogin from '../../../login/Component/googleLogin/GoogleLoginButton';

const BottomSignup = () => {

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
    <View>
      <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#0037C1' }]}onPress={handleFacebookLogin}>
        <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialText}>Facebook</Text>
      </TouchableOpacity>


       <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#FF3D3D' }]} onPress={handleGoogleLogin} disabled={!googleRequest}>
        <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialText}>Google</Text>
      </TouchableOpacity>


      <Text style={styles.loginPrompt}>
        Bạn đã có tài khoản? <Text style={styles.loginLink} onPress={()=> router.push('/(stack)/login/loginEmail')}>Đăng nhập</Text>
      </Text>
    </View>
  );
};


export default BottomSignup

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 14,
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {
    marginRight: 10,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginPrompt: {
    textAlign: 'center',
    color: '#AAA',
    marginTop: 30,
  },
  loginLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});