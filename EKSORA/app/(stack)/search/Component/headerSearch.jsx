import { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../../../constants/colors";

export default function HeaderSearch() {
  const [searchText, setSearchText] = useState("");
  const [historySearch, setHistorySearch] = useState([]);
  const popularSearch = [
    "tràng an",
    "Hà Nội",
    "đà nẵng",
    "hạ long",
    "hồ chí minh",
    "Ninh Bình",
  ];

  useEffect(() => {
    const loadHistory = async () => {
      const stored = await AsyncStorage.getItem("searchHistory");
      setHistorySearch(stored ? JSON.parse(stored) : []);
    };
    loadHistory();
  }, []);

  const saveSearchHistory = async (keyword) => {
    let updated = [keyword, ...historySearch.filter((item) => item !== keyword)];
    if (updated.length > 10) updated = updated.slice(0, 10);
    setHistorySearch(updated);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const clearSearchHistory = async () => {
    await AsyncStorage.removeItem("searchHistory");
    setHistorySearch([]);
  };

  const handleSearch = async (keyword) => {
    if (!keyword) return;
    await saveSearchHistory(keyword);
    router.push({
      pathname: "/(stack)/SearchResult",
      params: { query: keyword },
    });
  };

  return (
    <View style={styles.header}>
      {/* Back button + Search bar */}
      <View style={styles.searchWrapper}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Tìm Kiếm"
          placeholderTextColor={COLORS.gradientBackground}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => handleSearch(searchText)}
        />
        <TouchableOpacity style={styles.iconWrapper} onPress={() => handleSearch(searchText)}>
          <Ionicons name="search" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lịch sử tìm kiếm */}
      {historySearch.length > 0 && (
        <>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionLabel}>Lịch sử tìm kiếm</Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearText}>Xoá</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keywordWrap}>
            {historySearch.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleSearch(item)}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Mọi người đang tìm kiếm */}
      <Text style={styles.sectionLabel}>Mọi người đang tìm kiếm</Text>
      <View style={styles.keywordWrap}>
        {popularSearch.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleSearch(item)}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <Ionicons name="chevron-down" size={18} color="#999" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.gradientBackground,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backBtn: {
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  sectionLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  clearText: {
    fontSize: 12,
    color:  COLORS.primary,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  keywordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  chip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#333",
  },
});