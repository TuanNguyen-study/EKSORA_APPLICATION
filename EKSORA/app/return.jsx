import { LinearGradient } from "expo-linear-gradient"; // 👈 cần import
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Nền gradient */}
      <LinearGradient
        colors={[
          "#2F80ED",
          "#479DEB",
          "#56CCF2",
          "#A3DFF7",
          "#b5e4f7ff",
          "#FFFFFF",
        ]}
        locations={[0, 0.2, 0.4, 0.65, 0.8, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Spot hiệu ứng */}
      <View style={[styles.spot, { top: 60, left: 30, opacity: 0.15 }]} />
      <View style={[styles.spot, { top: 100, right: 50, opacity: 0.1 }]} />
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.image}
        resizeMode="contain"
      />
      {/* Nội dung */}
      <Text style={styles.title}>Thanh toán thành công!</Text>



      <Image
        source={require('../assets/images/tick.png')} // đường dẫn tới ảnh local
        style={{ width: 100, height: 100, marginVertical: 16 }}
      />

      {/* <Text style={styles.description}>Thanh toán thành công!</Text> */}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.secondaryButtonText}>Quay về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  spot: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 24,
    zIndex: 1,
  },
  image: {
    width: 200,
    height: 160,
    zIndex: 1,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 32,
    zIndex: 1,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    zIndex: 1,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});