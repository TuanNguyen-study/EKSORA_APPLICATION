import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import { loginGoogle } from '../../../../API/services/googleService';
// import { loginFacebook } from '../../../../API/services/FacebookService';

import Toast from 'react-native-toast-message';


const BottomSignup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');


  // Function to handle Google login
  // const handleGoogleLogin = async () => {
  //   try {
  //     setIsLoading(true);
  //     setLoadingMessage('Đang kết nối với Google...');

  //     try {
  //       await GoogleSignin.revokeAccess();
  //       await GoogleSignin.signOut();
  //     } catch (signOutError) {
  //       console.log('[GoogleLogin] Không thể clear cache:', signOutError.message);

  //     }

  //     await GoogleSignin.hasPlayServices();
  //     setLoadingMessage('Đang xác thực tài khoản...');


  //     const userInfo = await GoogleSignin.signIn();
  //     if (!userInfo || userInfo.type === 'cancel' || Object.keys(userInfo).length <= 1) {
  //       console.log('[GoogleLogin] ❌ Đăng nhập bị huỷ hoặc không có thông tin.');
  //       return;
  //     }

  //     let idToken = userInfo.idToken || userInfo.data?.idToken;

  //     if (!idToken) {
  //       try {
  //         const currentUser = await GoogleSignin.getCurrentUser();
  //         idToken = currentUser?.idToken;
  //       } catch {}

  //       if (!idToken) {
  //         try {
  //           const tokens = await GoogleSignin.getTokens();
  //           idToken = tokens?.idToken;
  //         } catch {}
  //       }
  //     }

  //     if (!idToken || idToken.length < 100) {
  //       Alert.alert('Lỗi', 'Không thể xác thực Google. Token không hợp lệ.');
  //       return;
  //     }

  //     setLoadingMessage('Đang hoàn tất đăng nhập...');
  //     const result = await dispatch(loginGoogle({ token: idToken }));

  //     if (loginGoogle.fulfilled.match(result)) {
  //       Alert.alert('Thành công', 'Đăng nhập Google thành công!');
  //       router.replace('/(tabs)/home');
  //     } else {
  //       Alert.alert('Lỗi đăng nhập', result.payload || 'Đăng nhập thất bại');
  //     }

  //   } catch (error) {
  //     console.log('[GoogleLogin] ❌ Lỗi:', error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
  //     if (error.code === statusCodes.IN_PROGRESS) {
  //       Alert.alert('Thông báo', 'Đang xử lý đăng nhập...');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       Alert.alert('Lỗi', 'Google Play Services không khả dụng');
  //     } else {
  //       Alert.alert('Lỗi', 'Có lỗi khi đăng nhập Google. Vui lòng thử lại.');
  //     }
  //   } finally {
  //     setIsLoading(false);
  //     setLoadingMessage('');
  //   }
  // };

  // Function to handle Facebook login
  // const handleFacebookLogin = async () => {
  //   setIsLoading(true);
  //   setLoadingMessage('Đang kết nối với Facebook...');

  //   try {
  //     const result = await LoginManager.logInWithPermissions([
  //       "public_profile",
  //       "email",
  //     ]);


  //     const data = await AccessToken.getCurrentAccessToken();
  //     if (!data) {
  //       Alert.alert('Lỗi', 'Không lấy được token Facebook');
  //       setIsLoading(false);
  //       return;
  //     }

  //     const fbResponse = await fetch(
  //       `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${data.accessToken}`
  //     );
  //     const user = await fbResponse.json();

  //     if (user.error) {
  //       throw new Error(user.error.message);
  //     }

  //     const facebookData = {
  //       facebookUid: user.id,
  //       full_name: user.name,
  //       email: user.email || '',
  //       avatarUrl: user.picture?.data?.url || '',
  //       accessToken: data.accessToken,
  //     };

  //     const resultAction = await dispatch(loginFacebook(facebookData));

  //     if (loginFacebook.fulfilled.match(resultAction)) {
  //       const response = resultAction.payload;
  //       Alert.alert('Thành công', response?.message || "Đăng nhập Facebook thành công!", [
  //         {text: 'OK', onPress: () => router.replace("/home")}
  //       ]);
  //     } else if (loginFacebook.rejected.match(resultAction)) {
  //       const errorMessage = resultAction.payload || "Đăng nhập thất bại";
  //       Alert.alert('Lỗi', errorMessage);
  //       LoginManager.logOut();
  //     }

  //   } catch (error) {
  //     console.error("[ERROR] FacebookSignIn error:", error);
  //     LoginManager.logOut();
  //     Alert.alert('Lỗi', error.message || "Có lỗi xảy ra, vui lòng thử lại");
  //   } finally {
  //     setIsLoading(false);
  //     setLoadingMessage('');
  //   }
  // };

  return (
    <View>

      {/* Nút Facebook - chỉ gọi đăng nhập khi bấm */}
      <TouchableOpacity
        style={[styles.socialBtn, { backgroundColor: '#2a6ee4ff' }]}
      //onPress={handleFacebookLogin}
      >
        <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialText}>Facebook</Text>
      </TouchableOpacity>

      {/* Nút Google - chỉ gọi đăng nhập khi bấm */}
      <TouchableOpacity
        style={[styles.socialBtn, { backgroundColor: '#FF3D3D' }]}
      //onPress={handleGoogleLogin}
      >
        <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialText}>Google</Text>
      </TouchableOpacity>



      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2a6ee4ff" />
          <Text style={styles.loadingText}>Đang đăng nhập...</Text>
        </View>
      )}

      {/* Liên kết đăng nhập */}
      <Text style={styles.loginPrompt}>
        Bạn đã có tài khoản?{' '}
        <Text
          style={styles.loginLink}
          onPress={() => router.replace('/(stack)/login/loginEmail')}
        >
          Đăng nhập
        </Text>
      </Text>
    </View>
  );
};

export default BottomSignup;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 14,
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  icon: {
    marginLeft: 10,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },



  loginPrompt: {
    textAlign: 'center',
    color: '#AAA',
    marginTop: 5,
  },
  loginLink: {
    color: '#2a6ee4ff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },

});
