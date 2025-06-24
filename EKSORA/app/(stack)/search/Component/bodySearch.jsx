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
    <ScrollView contentContainerStyle={styles.unifiedContainer} showsVerticalScrollIndicator={false}>
      {tours.map((item, index) => (
        <TouchableOpacity
          key={item.id || index}
          style={styles.unifiedCard}
          onPress={() => handlePressTour(item)}
        >
          <Text style={[styles.unifiedIndex, index === 0 && styles.firstIndex]}>{index + 1}</Text>
          <Image source={{ uri: item.image[0] }} style={styles.unifiedImage} />
          <View style={styles.unifiedContent}>
            <Text style={styles.unifiedTitle}>{item.title}</Text>
            <Text style={styles.unifiedLocation}>{item.location || item.province}</Text>
            <Text style={styles.unifiedPrice}>Từ {item.price.toLocaleString()}đ</Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab("top")}>
          <Text style={activeTab === "top" ? styles.tabActive : styles.tabInactive}>Top tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("trend")}>
          <Text style={activeTab === "trend" ? styles.tabActive : styles.tabInactive}>Điểm đến xu hướng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("visit")}>
          <Text style={activeTab === "visit" ? styles.tabActive : styles.tabInactive}>Top điểm tham quan</Text>
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
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabActive: {
    color: "#FF5722",
    fontWeight: "bold",
    fontSize: 16,
  },
  tabInactive: {
    color: "#999",
    fontSize: 16,
  },
  unifiedContainer: {
    backgroundColor: "#fff",
    marginHorizontal: width * 0.04,
    marginVertical: 12,
    borderRadius: 12,
    padding: 10,
    ...cardShadow,
  },
  unifiedCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  unifiedIndex: {
    backgroundColor: "#FF5722",
    color: "#fff",
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 24,
    borderRadius: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  firstIndex: {
    backgroundColor: "#FF5722",
  },
  unifiedImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  unifiedContent: {
    flex: 1,
  },
  unifiedTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111",
  },
  unifiedLocation: {
    fontSize: 13,
    color: "#555",
  },
  unifiedPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FF5722",
    marginTop: 2,
  },
  ratingBox: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
