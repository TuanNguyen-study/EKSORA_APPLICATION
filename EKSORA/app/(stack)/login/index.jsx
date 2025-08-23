import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { 
  Dimensions, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated,
  StatusBar
} from 'react-native';
import { COLORS } from '../../../constants/colors';

const { width, height } = Dimensions.get('window');

// Particle component
const ParticleView = () => {
  const animatedValues = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(height),
      translateX: new Animated.Value(Math.random() * width),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const animations = animatedValues.map((particle, index) => {
      const animateParticle = () => {
        particle.translateY.setValue(height + 50);
        particle.translateX.setValue(Math.random() * width);
        particle.opacity.setValue(0);

        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(particle.translateY, {
              toValue: -50,
              duration: 15000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: Math.random() * width,
              duration: 15000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => animateParticle());
      };

      setTimeout(() => animateParticle(), index * 500);
      return animateParticle;
    });

    return () => animations.forEach(cleanup => cleanup && cleanup());
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {animatedValues.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Check tick animation component
const CheckTickAnimation = () => {
  const circleScale = useRef(new Animated.Value(0)).current;
  const tickOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runAnimation = () => {
      // Reset values
      circleScale.setValue(0);
      tickOpacity.setValue(0);
      containerOpacity.setValue(0);

      Animated.sequence([
        // Fade in container
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Circle scale animation
        Animated.spring(circleScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Tick draw animation
        Animated.timing(tickOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // Wait 3 seconds
        Animated.delay(3000),
        // Fade out
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        // Wait 3 seconds before next cycle
        Animated.delay(3000),
      ]).start(() => runAnimation());
    };

    runAnimation();
  }, []);

  return (
    <Animated.View style={[styles.checkContainer, { opacity: containerOpacity }]}>
      <Animated.Text style={[styles.checkTick, { 
        opacity: tickOpacity,
        transform: [{ scale: circleScale }],
      }]}>
        ✓
      </Animated.Text>
    </Animated.View>
  );
};

// Discount animation component
const DiscountAnimation = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runAnimation = () => {
      // Reset values
      rotation.setValue(0);
      scale.setValue(0);
      containerOpacity.setValue(0);

      Animated.sequence([
        // Wait for tick animation to finish
        Animated.delay(6500),
        // Fade in
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Scale and rotate animation
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Stay visible for 3 seconds
        Animated.delay(3000),
        // Fade out
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        // Wait before next cycle
        Animated.delay(2200),
      ]).start(() => runAnimation());
    };

    runAnimation();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.discountContainer, { opacity: containerOpacity }]}>
      <Animated.View
        style={[
          styles.discountBadge,
          {
            transform: [
              { scale: scale },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <Text style={styles.discountText}>-50%</Text>
      </Animated.View>
    </Animated.View>
  );
};

const onboardingData = [
  {
    id: 1,
    title: 'Chào mừng đến với Eksora',
    description: 'Khám phá những điểm đến tuyệt vời với dịch vụ du lịch chất lượng cao',
    image: require('../../../assets/images/Logo.png'),
  },
  {
    id: 2,
    title: 'Đặt tour dễ dàng',
    description: 'Tìm kiếm và đặt tour nhanh chóng với giao diện thân thiện',
    image: require('../../../assets/images/tick.png'),
    showCheckAnimation: true,
  },
  {
    id: 3,
    title: 'Ưu đãi hấp dẫn',
    description: 'Nhận nhiều ưu đãi và khuyến mãi đặc biệt dành riêng cho bạn',
    image: require('../../../assets/images/percent.png'),
    showDiscountAnimation: true,
  },
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, []);

  const handleNext = async () => {
    if (currentSlide < onboardingData.length - 1) {
      const nextIndex = currentSlide + 1;
      setCurrentSlide(nextIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
      }
    } else {
      try {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(tabs)/home');
      } catch (error) {
        console.error('Lỗi khi lưu trạng thái onboarding:', error);
        router.replace('/(tabs)/home');
      }
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)/home'); 
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái onboarding:', error);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.bgOverlay} />
        <ParticleView />
        
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const contentOffsetX = e.nativeEvent.contentOffset.x;
            const newIndex = Math.round(contentOffsetX / width);
            setCurrentSlide(newIndex);
          }}
          scrollEventThrottle={16}
        >
          {onboardingData.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.imageContainer}>
                <Animated.View
                  style={[
                    styles.logoContainer,
                    slide.id === 1 && {
                      transform: [{ translateY: logoFloat }],
                    },
                  ]}
                >
                  <Image 
                    source={slide.image} 
                    style={[
                      styles.image,
                      { tintColor: 'white' }
                    ]} 
                  />
                </Animated.View>
                
                {slide.showCheckAnimation && <CheckTickAnimation />}
                {slide.showDiscountAnimation && <DiscountAnimation />}
              </View>
              
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentSlide === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            {currentSlide < onboardingData.length - 1 ? (
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Bỏ qua</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 80 }} />
            )}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>
                {currentSlide === onboardingData.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primaryDark,
    zIndex: -1,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 40,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  skipText: {
    color: 'white',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextText: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '600',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  checkContainer: {
    position: 'absolute',
    top: 50,
    right: 50,
    zIndex: 10,
  },
  checkTick: {
    fontSize: 60,
    color: '#22C55E',
    fontWeight: 'bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  discountContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 10,
  },
  discountBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  discountText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;