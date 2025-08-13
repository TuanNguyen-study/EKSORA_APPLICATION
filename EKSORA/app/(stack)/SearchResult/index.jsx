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
  const { query } = useLocalSearchParams();
  const [filteredTours, setFilteredTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);

        const queryTrimmed = query?.trim() || "";
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(queryTrimmed);

        let all = [];

        if (isObjectId) {
          // Gọi API theo cateID (id MongoDB)
          console.log("Gọi API với cateID:", queryTrimmed);
          all = await getAllToursByLocation(queryTrimmed);
        } else {
          // Gọi API lấy tất cả tour, sau đó lọc
          console.log("Gọi API lấy tất cả tour để lọc theo name:", queryTrimmed);
          all = await getAllToursByLocation();
        }

        // Lọc tour có giá > 0
        const validTours = all.filter((tour) => tour.price > 0);

        const queryLower = queryTrimmed.toLowerCase();

        // Lọc theo cateID.name
        const matchedByCategory = validTours.filter((tour) =>
          (tour.cateID?.name || "").toLowerCase().includes(queryLower)
        );

        // Lọc theo tên tour hoặc mô tả
        const matchedByText = validTours.filter(
          (tour) =>
            (tour.name || "").toLowerCase().includes(queryLower) ||
            (tour.description || "").toLowerCase().includes(queryLower)
        );

        // Ưu tiên cateID, nếu không có thì lấy matchedByText
        const matched =
          matchedByCategory.length > 0 ? matchedByCategory : matchedByText;

        setFilteredTours(matched);
        setAllTours(validTours);
      } catch (error) {
        console.error("Lỗi khi lấy tour:", error?.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [query]);

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
        <SearchHeader query={query} />
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
