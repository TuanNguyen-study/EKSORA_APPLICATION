import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUser } from '../../API/services/servicesUser';
import { COLORS } from '../../constants/colors';

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('ACCESS_TOKEN');
        const loginType = await AsyncStorage.getItem('LOGIN_TYPE');

        if (!token) {
          setIsLoggedIn(false);
          setUser(null);
          setAvatarUri(null);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        try {
          let userData = null;

          // Nếu là Google login, lấy từ AsyncStorage trước
          if (loginType === 'google') {
            const storedProfile = await AsyncStorage.getItem('USER_PROFILE');
            if (storedProfile) {
              userData = JSON.parse(storedProfile);
              console.log('[Header] Loaded Google user from AsyncStorage:', userData);
            }
          }

          // Nếu không phải Google hoặc không có data trong storage, gọi API
          if (!userData) {
            userData = await getUser();
            console.log('[Header] Loaded user from API:', userData);
          }

          setUser(userData);

          // Xử lý avatar
          const localAvatar = await AsyncStorage.getItem('LOCAL_AVATAR_URI');
          setAvatarUri(localAvatar || (userData ? userData.avatar : null));

        } catch (err) {
          console.error('Không lấy được thông tin user:', err);
          
          // Fallback: thử lấy từ AsyncStorage nếu API fail
          try {
            const storedProfile = await AsyncStorage.getItem('USER_PROFILE');
            if (storedProfile) {
              const userData = JSON.parse(storedProfile);
              setUser(userData);
              setAvatarUri(userData.avatar);
              console.log('[Header] Fallback to stored profile:', userData);
            } else {
              setIsLoggedIn(false);
              setUser(null);
              setAvatarUri(null);
            }
          } catch (storageError) {
            console.error('Storage fallback failed:', storageError);
            setIsLoggedIn(false);
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }, [])
  );

  // Giao diện loading
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 220 }]}>
        <ActivityIndicator size="small" color={COLORS.white} />
      </View>
    );
  }

  // --- GIAO DIỆN KHÁCH ---
  if (!isLoggedIn) {
    return (
      <View style={[styles.container, styles.guestHeader]}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.guestAvatar}
        />
        <View>
          <Text style={styles.guestUsername}>Chào mừng bạn!</Text>
          <Text style={styles.guestMessage}>Khám phá Eksora ngay hôm nay</Text>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push({
            pathname: '/(stack)/login/loginEmail',
            params: { redirectTo: '/(stack)/acount/settingScreen' }
          })}
        >
          <Text style={styles.loginButtonText}>Đăng nhập / Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Giao diện khi có token nhưng API lỗi
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 220 }]}>
        <Text style={{ color: COLORS.white }}>Không thể tải thông tin.</Text>
      </View>
    );
  }

  // --- GIAO DIỆN CHO NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ---
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userInfoContainer} onPress={() => router.push('/(stack)/UpdateUser')}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/favicon.png')}
          style={styles.avatar}
        />
        <View style={styles.textGroup}>
          <Text style={styles.username}>{user.first_name || user.name || 'Xin chào'}</Text>
          <Text style={styles.update}>Xem & cập nhật thông tin cá nhân</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.membershipCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.membershipLevel}>Thành viên Eksora</Text>
          <Ionicons name="shield-checkmark" size={20} color="white" />
        </View>
        <Text style={styles.cardNumber}>
          {((user._id || user.id)?.slice(-12) || '------------').toUpperCase().replace(/(.{4})/g, '$1 ').trim()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  guestHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
  },
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginBottom: 12,
  },
  guestUsername: {
    fontWeight: 'bold',
    fontSize: 22,
    color: COLORS.white,
    textAlign: 'center',
  },
  guestMessage: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  textGroup: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 22,
    color: COLORS.white,
  },
  update: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  membershipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipLevel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontWeight: '600',
  },
  cardNumber: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 3,
    marginTop: 12,
  },
});