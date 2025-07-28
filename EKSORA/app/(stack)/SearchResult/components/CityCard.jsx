import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
});

export default function CityCard({ province, image }) {
  return (
    <View style={[styles.cityCard, cardShadow]}>
      <Image source={{ uri: image }} style={styles.cityImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cityTitle}>{province}</Text>
        <Text style={styles.cityDesc} numberOfLines={2}>
          Khám phá các hoạt động, khách sạn, bí kíp du lịch và nhiều điều thú vị khác tại đây
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  cityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cityTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  cityDesc: {
    fontSize: 12,
    color: "#555",
  },
});
