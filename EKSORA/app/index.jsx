import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Index = () => {
  const [showLogo, setShowLogo] = useState(false);
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Tạo 4 sao băng
  const shootingStars = [
    useRef(new Animated.ValueXY({ x: width + 50, y: 100 })).current,
    useRef(new Animated.ValueXY({ x: width + 50, y: 180 })).current,
    useRef(new Animated.ValueXY({ x: width + 50, y: 250 })).current,
    useRef(new Animated.ValueXY({ x: width + 50, y: 60 })).current,
  ];
  const opacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Hiện logo
    const timer1 = setTimeout(() => {
      setShowLogo(true);
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Animate 4 sao băng với delay khác nhau
      shootingStars.forEach((star, i) => {
        setTimeout(() => {
          opacities[i].setValue(1);
          Animated.timing(star, {
            toValue: { x: -100, y: height - 200 + i * 40 }, // bay chéo xuống
            duration: 2500,
            useNativeDriver: true,
          }).start(() => {
            opacities[i].setValue(0);
          });
        }, 400 * i); // delay cho mỗi sao
      });
    }, 1000);

    // Navigation sau 4 giây
    const timer2 = setTimeout(async () => {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      if (token) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(stack)/onboarding');
      }
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.container}>
      {showLogo ? (
        <>
          <Animated.Image
            source={require('../assets/images/Logo.png')}
            style={[styles.logo, { opacity: logoOpacity }]}
          />

          {/* Render 4 sao băng */}
          {shootingStars.map((star, i) => (
            <Animated.View
              key={i}
              style={[
                styles.shootingStar,
                {
                  opacity: opacities[i],
                  transform: [
                    { translateX: star.x },
                    { translateY: star.y },
                    { rotate: '-45deg' },
                  ],
                },
              ]}
            >
              <View style={styles.starCore} />
              <View style={styles.starTail} />
            </Animated.View>
          ))}
        </>
      ) : null}
      {/* Nền xanh */}
      <View style={styles.bgOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primaryDark,
    zIndex: -1,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  shootingStar: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCore: {
    width: 4,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
  starTail: {
    width: 40,
    height: 2,
    backgroundColor: '#ffffff',
    marginLeft: -2,
    opacity: 0.8,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default Index;
