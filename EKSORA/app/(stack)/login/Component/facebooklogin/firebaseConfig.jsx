
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCnowNGng6PgwcPbRc0767tQUcnYgM4lQ4",
  authDomain: "eksora-a6869.firebaseapp.com",
  projectId: "eksora-a6869",
  storageBucket: "eksora-a6869.firebasestorage.app",
  messagingSenderId: "462414238701",
  appId: "1:462414238701:web:71a9f8050d528b008acde4"
};

const app = initializeApp(firebaseConfig);

// 👇 Đảm bảo chỉ khởi tạo auth một lần
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  // Nếu đã khởi tạo thì lấy lại
  console.log('Auth already initialized');
}

export { app, auth };