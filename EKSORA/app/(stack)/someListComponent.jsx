// import React, { useEffect } from 'react';
// import { TouchableOpacity, Alert } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// //import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { useRouter } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';
// //import { loginGoogle } from '../../API/services/googleService';

// const GoogleLoginButton = ({ setIsLoading, setLoadingMessage }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const user = useSelector((state) => state.auth.user);

//   // Log user mỗi khi Redux cập nhật
//   useEffect(() => {
//     console.log('[GoogleLoginButton] user từ Redux:', user);
//   }, [user]);

//   const handleGoogleLogin = async () => {
//     try {
//       setIsLoading?.(true);
//       setLoadingMessage?.('Đang kết nối với Google...');

//       // Clear cache trước
//       try {
//         await GoogleSignin.revokeAccess();
//         await GoogleSignin.signOut();
//       } catch (signOutError) {
//         console.log('[GoogleLogin] Không thể clear cache:', signOutError.message);
//       }

//       await GoogleSignin.hasPlayServices();
//       setLoadingMessage?.('Đang xác thực tài khoản...');

//       const userInfo = await GoogleSignin.signIn();
//       if (!userInfo || userInfo.type === 'cancel' || Object.keys(userInfo).length <= 1) {
//         console.log('[GoogleLogin] ❌ Đăng nhập bị huỷ hoặc không có thông tin.');
//         return;
//       }

//       let idToken = userInfo.idToken || userInfo.data?.idToken;

//       if (!idToken) {
//         try {
//           const currentUser = await GoogleSignin.getCurrentUser();
//           idToken = currentUser?.idToken;
//         } catch {}

//         if (!idToken) {
//           try {
//             const tokens = await GoogleSignin.getTokens();
//             idToken = tokens?.idToken;
//           } catch {}
//         }
//       }

//       if (!idToken || idToken.length < 100) {
//         Alert.alert('Lỗi', 'Không thể xác thực Google. Token không hợp lệ.');
//         return;
//       }

//       setLoadingMessage?.('Đang hoàn tất đăng nhập...');
//       const result = await dispatch(loginGoogle({ token: idToken }));

//       if (loginGoogle.fulfilled.match(result)) {
//         Alert.alert('Thành công', 'Đăng nhập Google thành công!');
//       } else {
//         Alert.alert('Lỗi đăng nhập', result.payload || 'Đăng nhập thất bại');
//       }

//       // --- LOGIC REDIRECT ---
//       let targetRoute = "/(tabs)/home"; // default fallback
//       const redirectTo = result.payload?.redirectTo; // lấy redirectTo nếu backend trả về

//       if (redirectTo && typeof redirectTo === "string") {
//         if (redirectTo.includes("bookings")) {
//           targetRoute = "/(tabs)/trips";
//         } else if (redirectTo.includes("trip-detail")) {
//           targetRoute = redirectTo;
//         } else if (redirectTo === "/(stack)/acount/settingScreen") {
//           targetRoute = "/(tabs)/account";
//         } else if (redirectTo === "/(tabs)/favorites") {
//           targetRoute = "/(tabs)/favorites";
//         } else {
//           targetRoute = redirectTo; // fallback nếu redirectTo hợp lệ
//         }
//       }

//       console.log("Navigating to:", targetRoute);

//       try {
//         router.replace(targetRoute);
//       } catch (navigationError) {
//         console.warn("Navigation failed, falling back to home:", navigationError);
//         router.replace("/(tabs)/home");
//       }

//     } catch (error) {
//       console.log('[GoogleLogin] ❌ Lỗi:', error);
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
//       if (error.code === statusCodes.IN_PROGRESS) {
//         Alert.alert('Thông báo', 'Đang xử lý đăng nhập...');
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         Alert.alert('Lỗi', 'Google Play Services không khả dụng');
//       } else {
//         Alert.alert('Lỗi', 'Có lỗi khi đăng nhập Google. Vui lòng thử lại.');
//       }
//     } finally {
//       setIsLoading?.(false);
//       setLoadingMessage?.('');
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={{
//         width: 56,
//         height: 56,
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#DB4437',
//       }}
//       onPress={handleGoogleLogin}
//     >
//       <FontAwesome name="google" size={24} color="white" />
//     </TouchableOpacity>
//   );
// }

// export default GoogleLoginButton;