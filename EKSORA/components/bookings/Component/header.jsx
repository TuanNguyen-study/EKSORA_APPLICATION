import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function Header({ scrollY }) {
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const scale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const offsetX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, (1 - 0.8) * textWidth * -0.5],
    extrapolate: "clamp",
  });

  const offsetY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, (1 - 0.8) * textHeight * -0.5],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.header}>
      <Animated.Text
        onLayout={(e) => {
          setTextWidth(e.nativeEvent.layout.width);
          setTextHeight(e.nativeEvent.layout.height);
        }}
        style={[
          styles.title,
          {
            transform: [
              { translateX: offsetX },
              { translateY: offsetY },
              { scale },
            ],
          },
        ]}
      >
        Chuyến đi
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#005c8b",
  },
});
