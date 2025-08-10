import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { getAllToursByLocation } from "../../../API/services/serverCategories";

import { COLORS } from '../../../constants/colors';
import CityCard from "../SearchResult/components/CityCard";
import SearchHeader from "../SearchResult/components/SearchHeader";
import TourCard from "../SearchResult/components/TourCard";

export default function index() {

  const { _id, name, image } = useLocalSearchParams();
  const [filteredTours, setFilteredTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = { _id, name, image };
    const fetchTours = async () => {
      setLoading(true);
      const all = await getAllToursByLocation(query);

      // Lọc tour có giá > 0
      const validTours = all.filter((tour) => tour.price > 0);

      const matched = validTours.filter((tour) =>
        tour.name.toLowerCase().includes(query.toLowerCase()) ||
        tour.description?.toLowerCase().includes(query.toLowerCase()) ||
        tour.province?.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredTours(matched);
      setAllTours(validTours); // allTours cũng là danh sách đã lọc
      setLoading(false);
    };
    fetchTours();
  }, [_id, name, image]);


  const renderItem = ({ item }) => (
    <TourCard item={item} onPress={() => router.push({ pathname: "/(stack)/trip-detail/[id]", params: { id: item._id } })} />
  );

  const ListHeader = () =>
    filteredTours[0] ? <CityCard province={filteredTours[0].cateID.name} image={filteredTours[0].image[0]} /> : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchHeader query={name} />
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
    color: COLORS.primaryDark
  },
});