import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React,{ useCallback, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Body from '../../../components/account/body';
import Header from '../../../components/account/header';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');

export default function AccountScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN');
        setIsLoggedIn(!!token); // true nếu có token, false nếu không
      };
      checkLogin();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Gradient nền */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={[
            '#2F80ED',
            '#479DEB',
            '#56CCF2',
            '#A3DFF7',
            '#FFFFFF',
            '#FFFFFF',
          ]}
          locations={[0, 0.2, 0.4, 0.65, 0.8, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradientBackground}
        />
        <View style={[styles.spot, { top: 60, left: 30, opacity: 0.15 }]} />
        <View style={[styles.spot, { top: 100, right: 50, opacity: 0.1 }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContentContainer,
          !isLoggedIn && { flex: 1, justifyContent: 'center' } // căn giữa nếu chưa login
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {isLoggedIn && <Body />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // <-- thay vì height: 280
  }, 
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  spot: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
});