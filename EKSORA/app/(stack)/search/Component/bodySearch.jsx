import { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { getTours } from "../../../../API/services/serverCategories";
import { COLORS } from "../../../../constants/colors";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
});

export default function Body() {
  const [activeTab, setActiveTab] = useState("top");
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response);
        setLoading(false);
      } catch (error) {
        setError("Lỗi khi lấy danh sách tours");
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handlePressTour = (tours) => {
    router.push({
      pathname: "/(stack)/trip-detail/[id]",
      params: { id: tours._id }
    });
  };

  const renderUnifiedItem = () => (
    <ScrollView
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    >
      {tours.map((item, index) => (
        <TouchableOpacity
          key={item.id || index}
          style={styles.cardContainer}
          onPress={() => handlePressTour(item)}
        >
          <View style={styles.indexCircle}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <Image source={{ uri: item.image[0] }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.cardLocation}>{item.location || item.province}</Text>
            <Text style={styles.cardPrice}>Từ {item.price.toLocaleString()}đ</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab("top")}>
          <Text style={[styles.tabText, activeTab === "top" && styles.activeTab]}>Top tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("trend")}>
          <Text style={[styles.tabText, activeTab === "trend" && styles.activeTab]}>Điểm đến theo xu hướng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("visit")}>
          <Text style={[styles.tabText, activeTab === "visit" && styles.activeTab]}>Top điểm tham quan</Text>
        </TouchableOpacity>
      </View>

      {!loading && renderUnifiedItem()}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    color: COLORS.black,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    color: COLORS.primaryAction,
    fontWeight: "bold",
    borderBottomColor: COLORS.primaryAction,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor:COLORS.primaryAction,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  indexText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.primaryAction,
  },
});
