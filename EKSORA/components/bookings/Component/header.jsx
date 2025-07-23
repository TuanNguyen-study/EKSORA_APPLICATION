import React from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ scrollY }) {
  // --- ANIMATION CHO TIÊU ĐỀ CHÍNH (TITLE) ---
  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.99], 
    extrapolate: 'clamp',
  });

  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -10], // Dịch chuyển lên trên
    extrapolate: 'clamp',
  });

  // --- ANIMATION CHO CÁC THÀNH PHẦN PHỤ (ICON VÀ SUBTITLE) ---
  const subElementsOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const subElementsTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -20], 
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View>
        <LinearGradient
          colors={['#56CCF2', '#2F80ED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          {/* ---- Nhóm các thành phần phụ để dễ dàng animate ---- */}
          <Animated.View style={[
            styles.subtitleContainer,
            { 
              opacity: subElementsOpacity,
              transform: [{ translateY: subElementsTranslateY }] 
            }
          ]}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={26} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.subtitle}>Quản lý các chuyến đi của bạn</Text>
          </Animated.View>

          {/* ---- Tiêu đề chính ---- */}
          <Animated.Text
            style={[
              styles.title,
              {
                transform: [
                  { scale: headerTitleScale },
                  { translateY: headerTitleTranslateY },
                ],
              },
            ]}
          >
            Vé Của Bạn
          </Animated.Text>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff', 
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});