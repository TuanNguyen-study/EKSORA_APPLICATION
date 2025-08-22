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

        if (!token) {
          setIsLoggedIn(false);
          setUser(null);
          setAvatarUri(null);
          setLoading(false);
          return;
        }

        try {
          const data = await getUser();
          setIsLoggedIn(true);
          setUser(data);

          const localAvatar = await AsyncStorage.getItem('LOCAL_AVATAR_URI');
          setAvatarUri(localAvatar || (data ? data.avatar : null));
        } catch (err) {
          console.log("❌ Token không hợp lệ, xoá dữ liệu cũ:", err);
          await AsyncStorage.multiRemove(["ACCESS_TOKEN", "LOCAL_AVATAR_URI", "USER_ID"]);
          setIsLoggedIn(false);
          setUser(null);
          setAvatarUri(null);
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
          onPress={() => router.push('/(stack)/login/loginEmail')}
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

  // --- GIAO DIỆN USER ---
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userInfoContainer} onPress={() => router.push('/(stack)/UpdateUser')}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/favicon.png')}
          style={styles.avatar}
        />
        <View style={styles.textGroup}>
          <Text style={styles.username}>{user.first_name || 'Xin chào'}</Text>
          <Text style={styles.update}>Xem & cập nhật thông tin cá nhân</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.membershipCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.membershipLevel}>Thành viên Eksora</Text>
          <Ionicons name="shield-checkmark" size={20} color="white" />
        </View>
        <Text style={styles.cardNumber}>
          {(user._id.slice(-12) || '------------').toUpperCase().replace(/(.{4})/g, '$1 ').trim()}
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
