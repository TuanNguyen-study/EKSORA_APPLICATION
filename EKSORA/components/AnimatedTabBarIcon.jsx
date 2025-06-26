import { useFocusEffect } from "@react-navigation/native";
import { Animated } from "react-native";
import { useRef, useCallback } from "react";

const AnimatedTabBarIcon = ({
  focused,
  activeIcon,
  inActiveIcon,
  IconComponent,
  color,
  size,
}) => {
  // Khởi tạo giá trị scale và vị trí Y
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  // Hàm animation: scale lên & trồi lên rồi về lại bình thường
  const animate = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 1.2,           // Phóng to
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,             // Thu nhỏ lại
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(translateYValue, {
          toValue: -10,            // Trồi lên 8px
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,             // Về lại vị trí cũ
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Gọi animation mỗi khi tab được focus
  useFocusEffect(
    useCallback(() => {
      if (focused) {
        animate();
      }
    }, [focused])
  );

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleValue },        
          { translateY: translateYValue }, 
        ],
      }}
    >
      <IconComponent
        name={focused ? activeIcon : inActiveIcon}
        size={size}
        color={color}
      />
    </Animated.View>
  );
};

export default AnimatedTabBarIcon;
