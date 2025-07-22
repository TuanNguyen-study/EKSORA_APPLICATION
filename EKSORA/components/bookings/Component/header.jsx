import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


export default function Header({ scrollY }) {
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const scale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  const offsetX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, (1 - 0.85) * textWidth * -0.5],
    extrapolate: "clamp",
  });

  const offsetY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, (1 - 0.85) * textHeight * -0.5],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView>
      <LinearGradient
        colors={["#e0f7fa", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
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
          Vé của bạn
        </Animated.Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: Platform.OS === "android" ? 30 : 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#005c8b",
    letterSpacing: 0.5,
  },
});
