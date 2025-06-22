import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../../API/services/servicesUser';
export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data); // hoặc data.user nếu cần
      } catch (err) {
        console.error('Không lấy được thông tin user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={[styles.header, styles.center]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.header, styles.center]}>
        <Text>Không thể tải thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={50} color="black" />
        <View style={styles.textGroup}>
          <Text style={styles.username}>{user.first_name}</Text>
          <TouchableOpacity>
            <Text style={styles.update}>Cập nhật thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      <View style={styles.levelRow}>
        <View style={styles.levelBox}>
          <Text style={styles.level}>Lv.{user.level || 1}</Text>
          <Text style={styles.badge}>{user.badge || 'Bạc'}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.link}>Xem ưu đãi thành viên</Text>
        </TouchableOpacity>
      </View>

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
  header: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 35,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGroup: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  update: {
    color: '#007BFF',
    fontSize: 12,
  },
  levelRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  level: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 6,
    paddingHorizontal: 6,
    marginRight: 6,
    fontSize: 12,
    color: '#007BFF',
  },
  badge: {
    fontSize: 12,
    color: '#007BFF',
  },
  link: {
    color: '#007BFF',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
  verticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
});
