import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../../API/services/servicesUser'; 
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors'; 


// cắt lấy 12 ký tự cuối cùng của chuỗi ID. Kết quả: eb09b3f4c676
const formatJoinDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `Thành viên từ T${date.getMonth() + 1}, ${date.getFullYear()}`;
};

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setLoading(true); 
        try {
          const data = await getUser();
          setUser(data);
          const localAvatar = await AsyncStorage.getItem('LOCAL_AVATAR_URI');
          if (localAvatar) {
            setAvatarUri(localAvatar);
          } else if (data && data.avatar) { 
            setAvatarUri(data.avatar);
          } else {
            setAvatarUri(null); 
          }
        } catch (err) {
          console.error('Không lấy được thông tin user:', err);
          setUser(null); 
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
      return () => {};
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.headerBase, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.headerBase, styles.center]}>
        <Text style={{ color: COLORS.white }}>Không thể tải thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.headerBase}>
      {/* --- PHẦN THÔNG TIN USER --- */}
      <View style={styles.userInfoContainer}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/favicon.png')} 
          style={styles.avatar}
        />
        <View style={styles.textGroup}>
          <Text style={styles.username}>{user.first_name || 'Xin chào'}</Text>
          <TouchableOpacity onPress={() => router.push('/(stack)/UpdateUser')}>
            <Text style={styles.update}>Xem & cập nhật thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.membershipCard}>
        <View style={styles.cardHeader}>
            <Text style={styles.membershipLevel}>Thành viên Eksora</Text>
            <Ionicons name="shield-checkmark" size={22} color="rgba(255, 255, 255, 0.8)" />
        </View>

        <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>
                {user._id.slice(-12).toUpperCase().replace(/(.{4})/g, '$1 ')}
            </Text>
        </View>
        
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  headerBase: { 
    paddingHorizontal: 16,
    paddingBottom: 32, 
  },
  center: { 
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },

  userInfoContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  textGroup: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.white, 
  },
  update: {
    color: 'rgba(255, 255, 255, 0.9)', 
    fontSize: 13,
    marginTop: 4,
  },

  membershipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)', 
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 3, 3, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipLevel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600', 
  },
  cardNumberContainer: {
    paddingVertical: 10, 
  },
  cardNumber: {
    color: COLORS.white,
    fontSize: 16, 
    fontWeight: '500',
    letterSpacing: 2.5, 
    textAlign: 'center',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  cardValue: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});