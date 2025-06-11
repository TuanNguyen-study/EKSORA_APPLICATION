import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../../constants/colors";
import TripItem from "../../../components/bookings/TripItem";
import Header from "../../../components/bookings/Component/header";
import Body from "../../../components/bookings/Component/body";

export default function TripsScreen() {
  const scrollY = new Animated.Value(0);

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} />
      <Animated.FlatList
        data={[]}
        renderItem={({ item }) => <TripItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={<Body />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
