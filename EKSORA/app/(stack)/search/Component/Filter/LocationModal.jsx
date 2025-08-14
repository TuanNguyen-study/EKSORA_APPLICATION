import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { getCategories } from "../../../../../API/services/serverCategories";

const { height: screenHeight } = Dimensions.get("window");

export default function LocationModal({ visible, onClose, selectedLocation, setSelectedLocation }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (visible) fetchCategories();
  }, [visible]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      if (Array.isArray(data)) {
        setLocations(
          data.map((item) => ({
            id: item._id,
            name: item.name,
            image: item.image,
          }))
        );
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.log("Lỗi khi lấy categories:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter((loc) =>
    (loc.name || "").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chọn địa điểm</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm địa điểm..."
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
          </View>

          {/* List */}
          {loading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>Đang tải...</Text>
          ) : (
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ maxHeight: screenHeight * 0.7 }} // responsive: max 70% màn hình
              renderItem={({ item }) => {
                const isSelected = selectedLocation?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.locationRow,
                      isSelected && styles.locationRowActive,
                      isSelected && styles.locationRowBorder,
                    ]}
                    onPress={() =>
                      isSelected ? setSelectedLocation(null) : setSelectedLocation(item)
                    }
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={[styles.checkbox, isSelected && styles.checkboxChecked]}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.locationRowText,
                          isSelected && styles.locationRowTextActive,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    maxHeight: "90%", // tối đa 90% màn hình
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  locationRowActive: {
    backgroundColor: "#e8f0fe",
  },
  locationRowText: {
    fontSize: 16,
    color: "#333",
  },
  locationRowTextActive: {
    fontWeight: "600",
    color: "#007AFF",
  },
  locationRowBorder: {
    borderWidth: 1.5,
    borderColor: "#007AFF",
    borderRadius: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
});
