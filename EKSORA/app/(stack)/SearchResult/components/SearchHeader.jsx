import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SearchHeader({ query }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push("/(stack)/search")} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder={query}
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity onPress={() => router.push('/(stack)/ShoppingCartScreen')}>
      <Ionicons name="cart-outline" size={20} color="#333" style={styles.iconRight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
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
    fontSize: 14,
  },
  iconRight: {
    marginLeft: 8,
  },
});
