import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTours } from "../../../API/services/serverCategories";
import { COLORS } from "../../../constants/colors";


const { width } = Dimensions.get("window");

export default function SearchResult() {
  const { query } = useLocalSearchParams();
  const [filteredTours, setFilteredTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      const all = await getTours();
      const matched = all.filter((tour) =>
        tour.name.toLowerCase().includes(query.toLowerCase()) ||
        tour.description?.toLowerCase().includes(query.toLowerCase()) ||
        tour.province?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTours(matched);
      setAllTours(all);
      setLoading(false);
    };
    fetchTours();
  }, [query]);

  const handleSelectTour = (tour) => {
    router.push({
      pathname: "/(stack)/trip-detail/[id]",
      params: { id: tour._id },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectTour(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image[0] }} style={styles.cardImage} />
        <TouchableOpacity style={styles.heartIcon}>
          <Ionicons name="heart-outline" size={20} color="#444" />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.category}>
            Sự kiện & Show diễn - {item.province}
          </Text>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.confirm}>Miễn phí huỷ · Xác nhận tức thời</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {item.rating || "4.6"}</Text>
            <Text style={styles.review}>({item.reviews || "2,383"})</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.booked}>60K+ Đã được đặt</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Từ ₫ {item.price.toLocaleString()}</Text>
            <Text style={styles.oldPrice}>
              ₫ {(item.price * 1.2).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
        {["Tất cả", "Tour & Trải nghiệm", "Vé tham quan"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={selectedTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredTours[0] && (
        <View style={styles.cityCard}>
          <Image source={{ uri: filteredTours[0]?.image[0] }} style={styles.cityImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cityTitle}>{filteredTours[0]?.province}</Text>
            <Text style={styles.cityDesc} numberOfLines={2}>
              Khám phá các hoạt động, khách sạn, bí kíp du lịch và nhiều điều thú vị khác tại đây
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(stack)/search")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder={query}
          placeholderTextColor="#999"
        />
        <Ionicons name="cart-outline" size={20} color="#333" style={styles.iconRight} />
        <Ionicons name="ellipsis-vertical" size={20} color="#333" style={styles.iconRight} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      ) : filteredTours.length === 0 ? (
        <FlatList
          data={allTours.slice(0, 10)}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListHeaderComponent={
            <>
              <ListHeader />
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={60} color="#FF5722" style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>Rất tiếc, không có kết quả phù hợp.</Text>
                <Text style={styles.emptyDesc}>Vui lòng thử lại với từ khoá khác.</Text>
                <Text style={styles.suggestTitle}>Xem thêm gợi ý khác?</Text>
              </View>
            </>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredTours}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListHeaderComponent={<ListHeader />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
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
  tabRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderColor: "transparent",
    marginRight: 10,
  },
  activeTab: {
    borderBottomColor: COLORS.primaryAction,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    fontSize: 14,
    color:  COLORS.primaryAction,
    fontWeight: "bold",
  },
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  cityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cityTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  cityDesc: {
    fontSize: 12,
    color: "#555",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  emptyIcon: {
    marginBottom: 12,
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
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  cardContent: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  confirm: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    fontSize: 13,
    color: "#FF5722",
  },
  review: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: "#999",
  },
  booked: {
    fontSize: 12,
    color: "#666",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    color: COLORS.primaryAction,
    fontWeight: "bold",
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
  },
});
