import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUCCESS!</Text>

      {/* Ảnh minh hoạ */}
      <Image
        source={require("../../../assets/images/Logo.png")} // 👈 Bạn thay bằng ảnh của bạn hoặc vẽ SVG
        style={styles.image}
        resizeMode="contain"
      />

      <Ionicons name="checkmark-circle" size={64} color="green" style={{ marginVertical: 16 }} />

      <Text style={styles.description}>Thanh toán thành công!</Text>


      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.secondaryButtonText}>BACK TO HOME</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 24,
    backgroundColor: "#00639B",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 160,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: COLORS.black,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: COLORS.black,
    fontWeight: "bold",
  },
});
