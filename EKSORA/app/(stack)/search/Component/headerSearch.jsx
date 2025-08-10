import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { COLORS } from "../../../../constants/colors";

export default function HeaderSearch() {
  const [searchText, setSearchText] = useState("");
  const [historySearch, setHistorySearch] = useState([]);
  const popularSearch = [
    {
      _id: "683abaae06f0673f3f0eaa2d",
      name: "Ninh Bình",
      __v: 0,
      image: "https://i.pinimg.com/736x/49/1c/4a/491c4aeededdf7ece96ac7c5d070e745.jpg"
    },
    {
      _id: "682ec34331d8b56270a8af8b",
      name: "Hà Nội",
      image: "https://i.pinimg.com/736x/ac/27/50/ac2750aefd89c4cc77b963fad153d477.jpg"
    },
    {
      _id: "683ab9b506f0673f3f0eaa1d",
      name: "Đà Nẵng",
      __v: 0,
      image: "https://i.pinimg.com/736x/32/f0/11/32f01197c72d5fc489fbfbb1e3d015b2.jpg"
    },
    {
      _id: "682ec34331d8b56270a8af95",
      name: "Hạ Long",
      image: "https://i.pinimg.com/736x/e8/7d/87/e87d8748b8fdd2615c24b306eeca7e78.jpg"
    },
    {
      _id: "682ec34331d8b56270a8af8c",
      name: "Hồ Chí Minh",
      image: "https://i.pinimg.com/736x/83/2c/d1/832cd1e62c6068260bf9960e58f4e7d4.jpg"
    },
  ];



  useEffect(() => {
    const loadHistory = async () => {
      const stored = await AsyncStorage.getItem("searchHistory");
      setHistorySearch(stored ? JSON.parse(stored) : []);
    };
    loadHistory();
  }, []);

  const saveSearchHistory = async (keyword) => {
    let updated = [keyword, ...historySearch.filter((item) => item.name !== keyword.name)];
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
      params: { _id: keyword._id, name: keyword.name, image: keyword.image },
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
          placeholderTextColor='#ccc'
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
                  <Text style={styles.chipText}>{item.name}</Text>
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
              <Text style={styles.chipText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    color: COLORS.primary,
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