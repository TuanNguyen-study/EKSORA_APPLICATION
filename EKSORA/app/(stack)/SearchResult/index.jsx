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
} from "react-native";
import { getAllToursByLocation } from "../../../API/services/serverCategories";

import SearchHeader from "../SearchResult/components/SearchHeader";
import TourCard from "../SearchResult/components/TourCard";
import CityCard from "../SearchResult/components/CityCard";
import EmptyResult from "../SearchResult/components/EmptyResult";
import { COLORS } from "../../../constants/colors";

export default function Index() {
  const { query, filteredTours: filteredToursParam } = useLocalSearchParams();
  const [filteredTours, setFilteredTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tiêu chí lọc chung (giá & đánh giá)
  const [priceRange, setPriceRange] = useState([0, Infinity]); // [min, max]
  const [minRating, setMinRating] = useState(0); 
  const [suggestedTours, setSuggestedTours] = useState([]); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let toursData = [];

        // Nếu có filteredToursParam từ filter modal
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

          // Lọc theo query (cateID.name → name → description)
          const queryLower = queryTrimmed.toLowerCase();
          const matchedByCategory = validTours.filter((tour) =>
            (tour.cateID?.name || "").toLowerCase().includes(queryLower)
          );
          const matchedByText = validTours.filter(
            (tour) =>
              (tour.name || "").toLowerCase().includes(queryLower) ||
              (tour.description || "").toLowerCase().includes(queryLower)
          );

          toursData =
            matchedByCategory.length > 0 ? matchedByCategory : matchedByText;
        }

        // Lọc thêm giá & đánh giá (áp dụng chung cho cả search & filter)
        const finalTours = toursData
          .filter(
            (tour) => tour.price >= priceRange[0] && tour.price <= priceRange[1]
          )
          .filter((tour) => (tour.rating || 0) >= minRating);

        setAllTours(toursData); // dữ liệu gốc (chưa filter giá/đánh giá)
        setFilteredTours(finalTours);
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
    ) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchHeader query={query} filteredTours={filteredTours} />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : filteredTours.length === 0 ? (
          <FlatList
            data={allTours.slice(0, 10)}
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
    color: COLORS.primaryDark,
  },
});
