import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { getAllToursByLocation } from "../../../API/services/serverCategories";
import FilterModal from "../search/Component/Filter/ModalFilter"; // Modal lọc địa điểm, giá, sao
import PriceStarFilterModal from "../SearchResult/components/Filter/FilterPrice"; // Modal lọc giá, sao
import SearchHeader from "../SearchResult/components/SearchHeader";
import TourCard from "../SearchResult/components/TourCard";
import CityCard from "../SearchResult/components/CityCard";
import EmptyResult from "../SearchResult/components/EmptyResult";
import { COLORS } from "../../../constants/colors";

// Hàm loại bỏ dấu tiếng Việt
const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export default function Index() {
  const { query, filteredTours: filteredToursParam } = useLocalSearchParams();
  const [filteredTours, setFilteredTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [suggestedTours, setSuggestedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceStarModalVisible, setPriceStarModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let toursData = [];

        // Nếu có filteredToursParam từ FilterModal
        if (filteredToursParam) {
          toursData = JSON.parse(filteredToursParam);
        } else {
          // Nếu không → gọi API
          const queryTrimmed = query?.trim() || "";
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(queryTrimmed);

          let all = [];
          if (isObjectId) {
            all = await getAllToursByLocation(queryTrimmed);
          } else {
            all = await getAllToursByLocation();
          }

          // Lọc bỏ tour giá <= 0
          const validTours = all.filter((tour) => tour.price > 0);

          // Lọc theo query (chỉ khớp với cateID.name, hỗ trợ không dấu)
          const queryLower = removeDiacritics(queryTrimmed.toLowerCase());
          const matchedByCategory = validTours.filter((tour) =>
            removeDiacritics((tour.cateID?.name || "").toLowerCase()).includes(
              queryLower
            )
          );

          toursData = matchedByCategory; // Chỉ sử dụng cateID.name để lọc location
        }

        // Lọc thêm theo giá và sao
        const finalTours = toursData
          .filter(
            (tour) => tour.price >= priceRange[0] && tour.price <= priceRange[1]
          )
          .filter((tour) => (tour.rating || 0) >= minRating);

        // Lấy tour gợi ý nếu không có kết quả
        let suggested = [];
        if (finalTours.length === 0) {
          suggested = await getAllToursByLocation(); // Lấy tất cả tour làm gợi ý
          suggested = suggested.filter((tour) => tour.price > 0).slice(0, 10); // Lấy tối đa 10 tour
        }

        setAllTours(toursData);
        setFilteredTours(finalTours);
        setSuggestedTours(suggested);
      } catch (error) {
        console.error("Lỗi khi lấy tour:", error?.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, filteredToursParam, priceRange, minRating]);

  const renderItem = ({ item }) => (
    <TourCard
      item={item}
      onPress={() =>
        router.push({
          pathname: "/(stack)/trip-detail/[id]",
          params: { id: item._id },
        })
      }
    />
  );

  const ListHeader = () =>
    filteredTours[0] ? (
      <CityCard
        cateID={filteredTours[0].cateID?.name}
        image={filteredTours[0].image?.[0]}
      />
    ) : suggestedTours[0] ? (
      <View style={styles.suggestionHeader}>
      </View>
    ) : null;

  // Xử lý áp dụng bộ lọc từ PriceStarFilterModal
  const handleApplyPriceStarFilters = ({ priceRange, minRating }) => {
    setPriceRange(priceRange);
    setMinRating(minRating);
    setPriceStarModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchHeader
          query={query}
          filteredTours={filteredTours}
          onOpenFilter={() => setPriceStarModalVisible(true)}
        />
       
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryDark} />
          </View>
        ) : filteredTours.length === 0 ? (
          <FlatList
            data={suggestedTours}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListHeaderComponent={
              <>
                <ListHeader />
                <EmptyResult />
              </>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
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
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
        />
        <PriceStarFilterModal
          visible={priceStarModalVisible}
          onClose={() => setPriceStarModalVisible(false)}
          onApply={handleApplyPriceStarFilters}
          tours={allTours}
          initialPriceRange={priceRange}
          initialMinRating={minRating}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});