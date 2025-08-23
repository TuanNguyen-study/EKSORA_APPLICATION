import { FontAwesome } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import FloatingChatBox from '../components/FloatingChatBox';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FixedFloatingChatBotButton = () => {
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Sử dụng state thông thường thay vì Animated.ValueXY
  const [position, setPosition] = useState({ x: screenWidth - 80, y: screenHeight - 200 });
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const initialTouchPosition = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        // Lưu vị trí ban đầu
        dragStartPosition.current = { ...position };
        initialTouchPosition.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY
        };
      },
      onPanResponderMove: (evt, gestureState) => {
        // Tính toán vị trí mới dựa trên gesture
        const newX = dragStartPosition.current.x + gestureState.dx;
        const newY = dragStartPosition.current.y + gestureState.dy;
        
        // Giới hạn trong màn hình
        const buttonSize = 60;
        const maxX = screenWidth - buttonSize;
        const maxY = screenHeight - buttonSize - 100;
        const minX = 0;
        const minY = 50;
        
        const constrainedX = Math.max(minX, Math.min(maxX, newX));
        const constrainedY = Math.max(minY, Math.min(maxY, newY));
        
        setPosition({ x: constrainedX, y: constrainedY });
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        
        // Kiểm tra nếu là tap (không phải drag)
        const { dx, dy } = gestureState;
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          handlePress();
        }
        
        // Vị trí cuối cùng đã được set trong onPanResponderMove
        // Không cần làm gì thêm - button sẽ ở nguyên vị trí này
      },
    })
  ).current;

  const handlePress = () => {
    if (isDragging) return;
    setVisible(true);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <FloatingChatBox onClose={() => setVisible(false)} />
      </Modal>

      <View
        style={[
          styles.fabContainer,
          {
            left: position.x,
            top: position.y,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          style={[
            styles.fab,
            isDragging && styles.fabDragging
          ]} 
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Image 
            source={require('../../../../assets/images/Logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    zIndex: 999,
  },
  fab: {
    backgroundColor: '#2a6ee4ff', // Nền xanh cho logo
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabDragging: {
    elevation: 12,
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  logoImage: {
    width: 35,
    height: 35,
  },
});

export default FixedFloatingChatBotButton;