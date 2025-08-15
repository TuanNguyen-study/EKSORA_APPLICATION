import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, memo } from "react";
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
import FilterModal from "../search/Component/Filter/ModalFilter";
import PriceStarFilterModal from "../SearchResult/components/Filter/FilterPrice";
import SearchHeader from "../SearchResult/components/SearchHeader";
import TourCard from "../SearchResult/components/TourCard";
import CityCard from "../SearchResult/components/CityCard";
import EmptyResult from "../SearchResult/components/EmptyResult";
import { COLORS } from "../../../constants/colors";

const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const MemoizedTourCard = memo(TourCard);

export default function Index() {
  const { query, filteredTours: filteredToursParam } = useLocalSearchParams(); // Lấy tham số từ URL
  const [filteredTours, setFilteredTours] = useState([]); // State lưu danh sách tour đã lọc
  const [allTours, setAllTours] = useState([]); // State lưu tất cả tour ban đầu
  const [suggestedTours, setSuggestedTours] = useState([]); // State lưu tour gợi ý
  const [loading, setLoading] = useState(true); // State quản lý trạng thái loading
  const [filterModalVisible, setFilterModalVisible] = useState(false); // State quản lý hiển thị modal lọc
  const [priceStarModalVisible, setPriceStarModalVisible] = useState(false); // State quản lý hiển thị modal lọc giá & sao
  const [priceRange, setPriceRange] = useState([0, 5000000]); // State quản lý khoảng giá
  const [minRating, setMinRating] = useState(null); // State quản lý số sao tối thiểu

  useEffect(() => {
    // Hiệu ứng khi query hoặc filteredToursParam thay đổi, lấy dữ liệu tour
    const fetchData = async () => {
      try {
        setLoading(true); // Bật trạng thái loading khi bắt đầu lấy dữ liệu

        let toursData = [];

        if (filteredToursParam) {
          // Nếu có filteredTours từ tham số, parse JSON
          toursData = JSON.parse(filteredToursParam);
        } else {
          const queryTrimmed = query?.trim() || "";
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(queryTrimmed); // Kiểm tra xem query có phải là ObjectId

          let all = [];
          if (isObjectId) {
            all = await getAllToursByLocation(queryTrimmed); // Gọi API với cateID
          } else {
            all = await getAllToursByLocation(); // Gọi API lấy tất cả tour
          }

          const validTours = all.filter((tour) => tour.price > 0); // Lọc các tour có giá hợp lệ

          const queryLower = removeDiacritics(queryTrimmed.toLowerCase());
          const matchedByCategory = validTours.filter((tour) =>
            removeDiacritics((tour.cateID?.name || "").toLowerCase()).includes(queryLower)
          ); // Tìm tour khớp với query sau khi bỏ dấu

          toursData = matchedByCategory;
        }

        // Lấy tour gợi ý
        const suggested = await getAllToursByLocation();
        const validSuggested = suggested.filter((tour) => tour.price > 0).slice(0, 10); // Lấy 10 tour gợi ý hợp lệ

        setAllTours(toursData); // Cập nhật state allTours
        setFilteredTours(toursData); // Cập nhật state filteredTours
        setSuggestedTours(validSuggested); // Cập nhật state suggestedTours
      } catch (error) {
        console.error("Lỗi khi lấy tour:", error?.response?.data || error);
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
      }
    };

    fetchData();
  }, [query, filteredToursParam]);

  const fetchSuggestedTours = async () => {
    // Hàm lấy danh sách tour gợi ý
    try {
      const suggested = await getAllToursByLocation();
      const validSuggested = suggested.filter((tour) => tour.price > 0).slice(0, 10);
      return validSuggested;
    } catch (error) {
      console.error("Lỗi khi lấy suggested tours:", error?.response?.data || error);
      return [];
    }
  };

  const renderItem = ({ item }) => (
    // Hàm render mỗi item tour trong FlatList
    <MemoizedTourCard
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
    // Header của FlatList, hiển thị CityCard hoặc suggestion header
    filteredTours[0] ? (
      <CityCard cateID={filteredTours[0].cateID?.name} image={filteredTours[0].image?.[0]} />
    ) : suggestedTours[0] ? (
      <View style={styles.suggestionHeader}>
      </View>
    ) : null;

  const handleApplyPriceStarFilters = async ({ priceRange, minRating, filteredTours }) => {
    // Hàm xử lý khi áp dụng lọc giá và sao từ modal
    setPriceRange(priceRange); // Cập nhật khoảng giá
    setMinRating(minRating); // Cập nhật số sao tối thiểu
    setFilteredTours(filteredTours || []); // Cập nhật danh sách tour đã lọc

    // Nếu không có tour nào khớp, lấy lại tour gợi ý
    if (filteredTours.length === 0) {
      const newSuggestedTours = await fetchSuggestedTours();
      setSuggestedTours(newSuggestedTours);
    }

    setPriceStarModalVisible(false); // Đóng modal
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchHeader
          query={query}
          filteredTours={filteredTours}
          onOpenFilter={() => setPriceStarModalVisible(true)} // Mở modal lọc giá & sao
        />
       
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryDark} />
          </View>
        ) : (
          <>
            {filteredTours.length === 0 ? (
              <FlatList
                data={suggestedTours} // Hiển thị tour gợi ý khi không có tour lọc
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
                data={filteredTours} // Hiển thị tour đã lọc khi có kết quả
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
          onClose={() => setFilterModalVisible(false)} // Đóng modal lọc
        />
        <PriceStarFilterModal
          visible={priceStarModalVisible}
          onClose={() => setPriceStarModalVisible(false)} // Đóng modal lọc giá & sao
          onApply={handleApplyPriceStarFilters} // Xử lý khi áp dụng lọc
          tours={allTours} // Truyền danh sách tour ban đầu
          initialPriceRange={priceRange} // Giá trị khoảng giá ban đầu
          initialMinRating={minRating} // Giá trị số sao ban đầu
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