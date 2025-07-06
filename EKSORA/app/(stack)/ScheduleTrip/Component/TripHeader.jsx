// Component/TripHeader.jsx

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TripHeader() {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://condao.com.vn/uploads/news/2023_03/toan-canh-thi-tran-con-dao_1.jpg',
        }}
        style={styles.headerImage}
      />

      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => router.push('/(stack)/Schedule')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#ff4d4d' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="share-2" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="more-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.title}>3 ngày đi Côn Đảo từ Hồ Chí Minh</Text>
        <Text style={styles.subtitle}>09 thg 7 - 11 thg 7, 1 người</Text>
        <Text style={styles.author}>Tạo bởi Võ Minh</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 50,
  },
  headerImage: {
    width: '100%',
    height: 220,
  },
  topIcons: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  infoBox: {
    position: 'absolute',
    bottom: -25,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  author: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
