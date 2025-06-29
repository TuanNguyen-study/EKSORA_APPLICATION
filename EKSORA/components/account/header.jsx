import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../../API/services/servicesUser'; 
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors'; 


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
      return () => {

      };
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.headerBase, styles.center, { backgroundColor: 'transparent'}]}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.headerBase, styles.center, { backgroundColor: 'transparent'}]}>
        <Text style={{ color: COLORS.white }}>Không thể tải thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.textGroup}>
          <Text style={styles.username}>{user.first_name + '' + user.last_name}</Text>
          <TouchableOpacity>
            <Text style={styles.update} onPress={() => router.push('/(stack)/UpdateUser')}>Cập nhật thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      <View style={styles.levelRow}>
        <View style={styles.levelBox}>
          <Text style={styles.level}>Lv.{user.level || 1}</Text>
          <Text style={styles.badge}>{user.badge || 'Bạc'}</Text>

        </View>
      </View>

      {/* Phần statsContainer sẽ là một card trắng */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.couponCount || 0}</Text>
          <Text style={styles.statLabel}>Mã ưu đãi</Text>
        </View>
        <View style={styles.verticalSeparator} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.eksXu || 0}</Text>
          <Text style={styles.statLabel}>Eks Xu</Text>
        </View>
        <View style={styles.verticalSeparator} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.giftCardCount || 0}</Text>
          <Text style={styles.statLabel}>Eks Gift Card</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBase: { 
    paddingHorizontal: 16, 
  },
  onGradientSection: {
    paddingTop: 30,
    paddingBottom: 20, 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.avatarBackground,
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
    color: COLORS.white, 
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadgeContainer: { 
    backgroundColor: 'rgba(0,0,0,0.15)', 
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  level: {
    fontSize: 13,
    color: COLORS.white, 
    fontWeight: 'bold',
  },
  badge: {
    fontSize: 16,
    color: COLORS.white, 
    fontWeight: '600',
  },
  link: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white, 
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textGray,
    marginTop: 4,
  },
  verticalSeparator: {
    width: 1,
    height: '60%', 
    backgroundColor: COLORS.separator,
  },
  center: { 
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, 
    paddingTop: 50, 
  },
});