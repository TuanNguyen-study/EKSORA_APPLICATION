import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';

import Toast from 'react-native-toast-message';

const BottomLoginEmailOrPhone = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(''); // Track which provider is loading

  // Enhanced Google login with better error handling
  // const handleGoogleLogin = async () => {
  //   if (isLoading) return; // Prevent multiple simultaneous attempts
    
  //   try {
  //     setIsLoading(true);
  //     setLoadingProvider('google');

  //     // Clear previous session
  //     try {
  //       await GoogleSignin.revokeAccess();
  //       await GoogleSignin.signOut();
  //     } catch (signOutError) {
  //       console.log('[GoogleLogin] Cache clear warning:', signOutError.message);
  //     }

  //     // Check Play Services availability
  //     await GoogleSignin.hasPlayServices();

  //     // Perform sign in
  //     const userInfo = await GoogleSignin.signIn();
      
  //     // Validate user info
  //     if (!userInfo || userInfo.type === 'cancel' || Object.keys(userInfo).length <= 1) {
  //       console.log('[GoogleLogin] Sign in cancelled or no user info');
  //       return;
  //     }

  //     // Extract ID token with fallback methods
  //     let idToken = await getGoogleIdToken(userInfo);

  //     if (!idToken || idToken.length < 100) {
  //       throw new Error('Invalid Google authentication token');
  //     }

  //     // Dispatch login action
  //     const result = await dispatch(loginGoogle({ token: idToken }));

  //     if (loginGoogle.fulfilled.match(result)) {
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Đăng nhập thành công',
  //         text2: 'Chào mừng bạn quay trở lại!'
  //       });
  //       router.replace('/(tabs)/home');
  //     } else {
  //       const errorMessage = result.payload || 'Đăng nhập thất bại';
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Lỗi đăng nhập',
  //         text2: errorMessage
  //       });
  //     }

  //   } catch (error) {
  //     handleGoogleError(error);
  //   } finally {
  //     setIsLoading(false);
  //     setLoadingProvider('');
  //   }
  // };

  // Helper function to extract Google ID token
  // const getGoogleIdToken = async (userInfo) => {
  //   let idToken = userInfo.idToken || userInfo.data?.idToken;

  //   if (!idToken) {
  //     try {
  //       const currentUser = await GoogleSignin.getCurrentUser();
  //       idToken = currentUser?.idToken;
  //     } catch (error) {
  //       console.log('Failed to get current user token:', error);
  //     }

  //     if (!idToken) {
  //       try {
  //         const tokens = await GoogleSignin.getTokens();
  //         idToken = tokens?.idToken;
  //       } catch (error) {
  //         console.log('Failed to get tokens:', error);
  //       }
  //     }
  //   }

  //   return idToken;
  // };

  // Enhanced Google error handling
  // const handleGoogleError = (error) => {
  //   console.log('[GoogleLogin] Error:', error);
    
  //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //     return; // User cancelled, no need to show error
  //   }

  //   let errorMessage = 'Có lỗi khi đăng nhập Google. Vui lòng thử lại.';
    
  //   switch (error.code) {
  //     case statusCodes.IN_PROGRESS:
  //       errorMessage = 'Đang xử lý đăng nhập...';
  //       break;
  //     case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //       errorMessage = 'Google Play Services không khả dụng';
  //       break;
  //     default:
  //       if (error.message) {
  //         errorMessage = error.message;
  //       }
  //   }

  //   Toast.show({
  //     type: 'error',
  //     text1: 'Lỗi đăng nhập Google',
  //     text2: errorMessage
  //   });
  // };

  // Enhanced Facebook login
  // const handleFacebookLogin = async () => {
  //   if (isLoading) return; // Prevent multiple simultaneous attempts

  //   try {
  //     setIsLoading(true);
  //     setLoadingProvider('facebook');

  //     const result = await LoginManager.logInWithPermissions([
  //       "public_profile",
  //       "email",
  //     ]);

  //     if (result.isCancelled) {
  //       console.log('[FacebookLogin] Login cancelled by user');
  //       return;
  //     }

  //     const accessTokenData = await AccessToken.getCurrentAccessToken();
  //     if (!accessTokenData) {
  //       throw new Error('Không lấy được token Facebook');
  //     }

  //     // Fetch user profile with timeout
  //     const controller = new AbortController();
  //     const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  //     const fbResponse = await fetch(
  //       `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessTokenData.accessToken}`,
  //       { signal: controller.signal }
  //     );

  //     clearTimeout(timeoutId);

  //     if (!fbResponse.ok) {
  //       throw new Error('Failed to fetch Facebook profile');
  //     }

  //     const user = await fbResponse.json();

  //     if (user.error) {
  //       throw new Error(user.error.message);
  //     }

  //     const facebookData = {
  //       facebookUid: user.id,
  //       full_name: user.name,
  //       email: user.email || '',
  //       avatarUrl: user.picture?.data?.url || '',
  //       accessToken: accessTokenData.accessToken,
  //     };

  //     const resultAction = await dispatch(loginFacebook(facebookData));

  //     if (loginFacebook.fulfilled.match(resultAction)) {
  //       const response = resultAction.payload;
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Đăng nhập thành công',
  //         text2: response?.message || 'Chào mừng bạn đến với EKSORA!'
  //       });
  //       router.replace("/(tabs)/home");
  //     } else if (loginFacebook.rejected.match(resultAction)) {
  //       const errorMessage = resultAction.payload || "Đăng nhập thất bại";
  //       throw new Error(errorMessage);
  //     }

  //   } catch (error) {
  //     console.error("[FacebookLogin] Error:", error);
      
  //     // Clean up Facebook session on error
  //     try {
  //       await LoginManager.logOut();
  //     } catch (logoutError) {
  //       console.log('Failed to logout from Facebook:', logoutError);
  //     }

  //     Toast.show({
  //       type: 'error',
  //       text1: 'Lỗi đăng nhập Facebook',
  //       text2: error.message || "Có lỗi xảy ra, vui lòng thử lại"
  //     });
  //   } finally {
  //     setIsLoading(false);
  //     setLoadingProvider('');
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.line} />
      </View>

      {/* Facebook Login Button */}
      <TouchableOpacity
        style={[
          styles.socialBtn, 
          { backgroundColor: '#2a6ee4ff' },
          isLoading && loadingProvider !== 'facebook' && styles.disabledBtn
        ]}
        //onPress={handleFacebookLogin}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading && loadingProvider === 'facebook' ? (
          <ActivityIndicator size="small" color="#fff" style={styles.icon} />
        ) : (
          <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
        )}
        <Text style={styles.socialText}>
          {isLoading && loadingProvider === 'facebook' ? 'Đang kết nối...' : 'Facebook'}
        </Text>
      </TouchableOpacity>

      {/* Google Login Button */}
      <TouchableOpacity
        style={[
          styles.socialBtn, 
          { backgroundColor: '#DB4437' },
          isLoading && loadingProvider !== 'google' && styles.disabledBtn
        ]}
        //onPress={handleGoogleLogin}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading && loadingProvider === 'google' ? (
          <ActivityIndicator size="small" color="#fff" style={styles.icon} />
        ) : (
          <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
        )}
        <Text style={styles.socialText}>
          {isLoading && loadingProvider === 'google' ? 'Đang kết nối...' : 'Google'}
        </Text>
      </TouchableOpacity>

      <View style={styles.checkboxRow}>
        <Text style={styles.terms}>
          Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với{' '}
          <Text style={styles.linkText}>Điều Khoản Sử Dụng Chung</Text> và{' '}
          <Text style={styles.linkText}>Chính Sách Bảo Mật</Text> của EKSORA
        </Text>
      </View>
    </View>
  );
};

export default BottomLoginEmailOrPhone;

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
    marginTop: 5,
    position: 'relative',
    elevation: 2, // Android shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 10,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    marginTop: 20,
    flexWrap: "wrap",
  },
  terms: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  linkText: {
    color: '#2a6ee4ff',
    fontWeight: '600',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  orText: {
    marginHorizontal: 12,
    color: "#888",
    fontWeight: "500",
    fontSize: 14,
  },
});