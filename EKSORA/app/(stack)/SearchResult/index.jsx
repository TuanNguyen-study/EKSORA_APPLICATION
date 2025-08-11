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
import { getToursByLocation } from "../../../API/services/serverCategories";

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
        const all = await getToursByLocation();

        // Lọc tour có giá > 0
        const validTours = all.filter((tour) => tour.price > 0);

        // Kiểm tra xem query có trùng hẳn tên tỉnh/thành không
        const isExactProvince = validTours.some(
          (tour) =>
            tour.province?.name?.toLowerCase().trim() ===
            query.toLowerCase().trim()
        );

        let matched;
        if (isExactProvince) {
          // Nếu là search địa điểm thì chỉ lấy đúng địa điểm
          matched = validTours.filter(
            (tour) =>
              tour.province?.name?.toLowerCase().trim() ===
              query.toLowerCase().trim()
          );
        } else {
          // Nếu không phải search địa điểm thì tìm theo tên tour hoặc mô tả
          matched = validTours.filter(
            (tour) =>
              tour.name?.toLowerCase().includes(query.toLowerCase()) ||
              tour.description?.toLowerCase().includes(query.toLowerCase())
          );
        }

        setFilteredTours(matched);
        setAllTours(validTours);
      } catch (error) {
        console.error("Lỗi khi lấy tour:", error);
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
        image={filteredTours[0].image[0]}
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
