import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../../../constants/colors";

export default function SearchHeader({ query, filteredTours = [], onOpenFilter }) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.push("/(stack)/search")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchInput}
          onPress={() => router.push("/(stack)/search")}
        >
          <Text style={styles.queryText}>
            {filteredTours.length > 0 ? filteredTours[0].cateID?.name : query || "Tìm kiếm"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={onOpenFilter}>
          <Ionicons name="options-outline" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(stack)/ShoppingCartScreen')}>
          <Ionicons name="cart-outline" size={20} color="#333" style={styles.iconRight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  queryText: {
    fontSize: 14,
    color: "#333",
  },
  iconRight: {
    marginLeft: 8,
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  tourChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tourText: {
    fontSize: 12,
    color: "#ccc",
  },
});