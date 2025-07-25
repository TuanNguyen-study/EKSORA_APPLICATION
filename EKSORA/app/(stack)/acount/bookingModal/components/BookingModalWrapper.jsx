import React, { useEffect, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated, 
  Dimensions, 
} from 'react-native';
import BookingModal from '../index';

// Lấy chiều cao của màn hình
const { height } = Dimensions.get('window');

export default function BookingModalWrapper({ visible, onClose, bookingDetails }) {
  // 2. Tạo một giá trị Animated, khởi tạo ở vị trí dưới màn hình
  const slideAnim = useRef(new Animated.Value(height)).current;

  // 3. Dùng useEffect để điều khiển animation khi `visible` thay đổi
  useEffect(() => {
    if (visible) {
      // Nếu modal hiển thị, trượt lên vị trí 0 (trên màn hình)
      Animated.timing(slideAnim, {
        toValue: 0, // Vị trí cuối cùng
        duration: 400, // Tốc độ animation (ms), bạn có thể chỉnh để nhanh/chậm hơn
        useNativeDriver: true, // Cải thiện hiệu năng
      }).start();
    } else {
      // Nếu modal ẩn đi, trượt xuống lại vị trí ban đầu (dưới màn hình)
      Animated.timing(slideAnim, {
        toValue: height, // Về lại vị trí ban đầu
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
      });
    }
  }, [visible, slideAnim]);

  return (
    // 5. Đặt animationType="none" để chúng ta tự quản lý
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* 4. Thay View bằng Animated.View và áp dụng style transform */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }], 
          },
        ]}
      >
        <BookingModal onClose={onClose} bookingDetails={bookingDetails} />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%', 
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});