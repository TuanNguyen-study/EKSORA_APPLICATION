// Thêm vào settingScreen.jsx hoặc tạo component debug riêng
import AsyncStorage from '@react-native-async-storage/async-storage';

const debugAsyncStorage = async () => {
  try {
    const keys = ['ACCESS_TOKEN', 'USER_ID', 'USER_PROFILE', 'LOGIN_TYPE'];
    const values = await AsyncStorage.multiGet(keys);
    
    console.log('=== AsyncStorage Debug ===');
    values.forEach(([key, value]) => {
      console.log(`${key}:`, value);
      if (key === 'USER_PROFILE' && value) {
        try {
          const parsed = JSON.parse(value);
          console.log(`${key} parsed:`, parsed);
        } catch (e) {
          console.log(`Error parsing ${key}:`, e);
        }
      }
    });
    console.log('=== End Debug ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
};

// Gọi hàm này trong component để debug
// debugAsyncStorage();