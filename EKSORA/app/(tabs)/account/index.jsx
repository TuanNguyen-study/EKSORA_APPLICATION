import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../../components/account/header';
import Body from '../../../components/account/body';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Gradient + đốm sáng overlay */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={[
            '#00639B',
            '#007BB5',
            '#0087CA',
            '#00AEEB',
            '#B2E4F9',
            '#FFFFFF',
            '#FFFFFF'
          ]}
          locations={[0, 0.15, 0.3, 0.45, 0.65, 0.85,1]}
          start={{  x: 0.5, y: 0}}
          end={{  x: 0.5, y: 1 }}
          style={styles.gradientBackground}
        />

        <View style={[styles.spot, { top: 60, left: 30, opacity: 0.15 }]} />
        <View style={[styles.spot, { top: 100, right: 50, opacity: 0.1 }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Body />
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
    height: 280,
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
