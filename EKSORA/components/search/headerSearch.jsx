import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { getTours } from "../../API/services/serverCategories";

export default function HeaderSearch() {
  const keywords = [
    "Tây ninh",
    "Đà nẵng",
    "Sapa cáp treo",
    "Bình thuận",
    "Tour đã phú quốc",
    "Hà nội",
  ];

  const [searchText, setSearchText] = useState("");
  const [filteredTours, setFilteredTours] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchTours = async () => {
    try {
      const allTours = await getTours();
      const matched = allTours.filter((tour) =>
        tour.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTours(matched);
      setShowDropdown(true);
    } catch (error) {
      console.error("Lỗi khi tìm tour:", error);
    }
  };

  const handleSelectTour = (tour) => {
    alert(`Bạn đã chọn tour: ${tour.name}`);
    setSearchText(tour.name);
    setShowDropdown(false); // Ẩn dropdown khi chọn xong
  };

  return (
    <View style={styles.header}>
      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Núi bà đen"
          placeholderTextColor="#007AFF"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchTours}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown danh sách tour */}
      {showDropdown && filteredTours.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredTours}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectTour(item)}
              >
                <Image
                  source={{ uri: item.image[0] }}
                  style={styles.dropdownImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dropdownTitle}>{item.name}</Text>
                  <Text style={styles.dropdownDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Tiêu đề */}
      <Text style={styles.sectionTitle}>Được tìm kiếm nhiều nhất</Text>

      {/* Danh sách keyword */}
      <View style={styles.keywordsContainer}>
        {keywords.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setSearchText(item);
              fetchTours();
            }}
          >
            <View style={styles.keywordChip}>
              <Text style={styles.keywordText}>{item}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 15,
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

  // Dropdown styles
  dropdownContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  dropdownImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  dropdownTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  dropdownDesc: {
    fontSize: 12,
    color: "#555",
  },
});
