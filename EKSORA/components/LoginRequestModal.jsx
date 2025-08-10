import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { BlurView } from 'expo-blur'; // Hiệu ứng mờ 
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
} from 'react-native-reanimated'; //  Thư viện cho animation mượt mà
import { LinearGradient } from 'expo-linear-gradient'; //  Tạo dải màu cho nút
export default function LoginRequestModal({ isVisible, onClose }) {
  const router = useRouter();

  //  --- Khởi tạo các giá trị cho animation ---
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.95);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  //  --- Tạo style động từ các giá trị animation ---
  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  //  --- Kích hoạt animation khi modal được mở ---
  useEffect(() => {
    if (isVisible) {
      // Animation cho nền và khung modal
      modalOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      
      // Animation cho nội dung bên trong, xuất hiện nối tiếp (stagger)
      contentOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
      contentTranslateY.value = withDelay(150, withTiming(0, { duration: 400 }));
    } else {
      // Reset khi đóng
      modalOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.95, { duration: 200 });
      contentOpacity.value = withTiming(0, { duration: 100 });
      contentTranslateY.value = withTiming(20, { duration: 100 });
    }
  }, [isVisible]);

  const handleNavigateToLogin = () => {
    onClose();
    router.push('/(stack)/login/loginEmail'); 
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none" // Tắt animation mặc định để dùng reanimated
      onRequestClose={onClose}
    >

      <BlurView intensity={25} tint="dark" style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
          <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
            
            <Image 
              source={require('../assets/images/Logo.png')} 
              style={styles.illustration}
            />
            
            <Text style={styles.title}>Khám Phá Toàn Diện</Text>
            
            <Text style={styles.message}>
              Hãy trở thành một phần của cộng đồng Eksora để trải nghiệm những tính năng độc quyền.
            </Text>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleNavigateToLogin}
              activeOpacity={0.8}
            >
              {/*  Dải màu Gradient cho nút bấm nổi bật */}
              <LinearGradient
                colors={['#FF6A88', COLORS.primary]} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.loginButtonText}>Bắt đầu ngay</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Lúc khác</Text>
            </TouchableOpacity>

          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 32, 
    padding: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', 
  },
  contentContainer: {
    alignItems: 'center',
    padding: 24,
  },
  illustration: {
    width: 180,
    height: 150,
    marginBottom: 24,
    resizeMode: 'contain',
    tintColor: 'black'

  },
  title: {
    fontSize: 26,
    fontWeight: '800', 
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  // Nút chính
  loginButton: {
    width: '100%',
    borderRadius: 18,
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 18,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: 'white',
  },
  // Nút phụ
  cancelButton: {
    marginTop: 16,
    padding: 10,
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#718096',
    fontWeight: '500',
  },
});