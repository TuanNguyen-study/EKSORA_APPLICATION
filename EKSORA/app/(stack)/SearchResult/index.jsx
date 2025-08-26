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
} from "react-native";
import { getAllToursByLocation } from "../../../API/services/serverCategories";
import FilterModal from "../search/Component/Filter/ModalFilter";
import PriceStarFilterModal from "../SearchResult/components/Filter/FilterPrice";
import SearchHeader from "../SearchResult/components/SearchHeader";
import TourCard from "../SearchResult/components/TourCard";
import EmptyResult from "../SearchResult/components/EmptyResult";
import { COLORS } from "../../../constants/colors";

// Hàm bỏ dấu tiếng Việt
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
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [minRating, setMinRating] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let toursData = [];

        if (filteredToursParam) {
          toursData = JSON.parse(filteredToursParam).filter(
            (tour) => tour.price > 0 && tour.cateID && tour.cateID.name
          );
        } else {
          const queryTrimmed = query?.trim() || "";
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(queryTrimmed);

          let all = [];
          if (isObjectId) {
            all = await getAllToursByLocation(queryTrimmed);
          } else {
            all = await getAllToursByLocation();
          }

          const validTours = all.filter(
            (tour) => tour.price > 0 && tour.status === "active"
          );


          // Lọc theo query với chuẩn hóa và bỏ description để chuẩn xác
          const queryNormalized = removeDiacritics(queryTrimmed).toLowerCase();
          const matchedByCategory = validTours.filter((tour) =>
            removeDiacritics(tour.cateID?.name || "").toLowerCase().includes(queryNormalized)
          );
          const matchedByText = validTours.filter(
            (tour) =>
              removeDiacritics(tour.name || "").toLowerCase().includes(queryNormalized)
          );

          toursData =
            matchedByCategory.length > 0 ? matchedByCategory : matchedByText;
        }

        const suggested = await getAllToursByLocation();
        const validSuggested = suggested
          .filter((tour) => tour.price > 0 && tour.status === "active")
          .slice(0, 10);

        setAllTours(toursData);
        setFilteredTours(toursData);
        setSuggestedTours(validSuggested);
        setIsFiltered(false); // reset khi tìm mới
      } catch (error) {
        console.error("Lỗi khi lấy tour:", error?.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, filteredToursParam]);

  const fetchSuggestedTours = async () => {
    try {
      const suggested = await getAllToursByLocation();
      const validSuggested = suggested
        .filter((tour) => tour.price > 0)
        .slice(0, 10);
      return validSuggested;
    } catch (error) {
      console.error(
        "Lỗi khi lấy suggested tours:",
        error?.response?.data || error
      );
      return [];
    }
  };

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
    filteredTours[0] || suggestedTours[0] ? (
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionTitle}>
          {filteredTours[0] ? "Kết quả tìm kiếm" : null}
        </Text>
      </View>
    ) : null;

  const handleApplyPriceStarFilters = async ({
    priceRange,
    minRating,
    filteredTours,
  }) => {
    setPriceRange(priceRange);
    setMinRating(minRating);
    setFilteredTours(filteredTours || []);
    setIsFiltered(true);

    if (filteredTours.length === 0) {
      const newSuggestedTours = await fetchSuggestedTours();
      setSuggestedTours(newSuggestedTours);
    }

    setPriceStarModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchHeader
          query={query}
          filteredTours={filteredTours}
          onOpenFilter={() => setPriceStarModalVisible(true)}
          isFiltered={isFiltered}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryDark} />
          </View>
        ) : (
          <>
            {filteredTours.length === 0 ? (
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
          </>
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
});