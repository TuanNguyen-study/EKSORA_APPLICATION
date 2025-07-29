import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";


export default function EmptyResult() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60}  style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>Rất tiếc, không có kết quả phù hợp.</Text>
      <Text style={styles.emptyDesc}>Vui lòng thử lại với từ khoá khác.</Text>
      <Text style={styles.suggestTitle}>Xem thêm gợi ý khác?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  emptyIcon: {
    marginBottom: 12,
    color: COLORS.primary
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  suggestTitle: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
});
