import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function HeaderSearch() {
  const keywords = [
    "Tây ninh",
    "Đà nẵng",
    "Sapa cáp treo",
    "Bình thuận",
    "Tour đã phú quốc",
    "Hà nội",
  ];

  return (
    <View style={styles.header}>
      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Núi bà đen"
          placeholderTextColor="#007AFF"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text style={styles.sectionTitle}>Được tìm kiếm nhiều nhất</Text>

      {/* Danh sách keyword */}
      <View style={styles.keywordsContainer}>
        {keywords.map((item) => (
          <View key={item} style={styles.keywordChip}>
            <Text style={styles.keywordText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: "#3B82F6",
    padding: 8,
    borderRadius: 20,
  },
  searchIcon: {
    color: "#fff",
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "500",
    fontSize: 14,
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keywordChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 12,
    color: "#111827",
  },
});
