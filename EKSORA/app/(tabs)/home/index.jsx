import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getCategories,
  getTours,
  getToursByLocation,
} from "../../../API/services/serverCategories";
import DestinationChip from "../../../components/home/DestinationChip";
import HeaderSearchBar from "../../../components/home/HeaderSearchBar";
import ImageCarouselCard from "../../../components/home/ImageCarouselCard";
import PromoBanner from "../../../components/home/PromoBanner";
import ServiceCategoryItem from "../../../components/home/ServiceCategoryItem";
import SuggestionCard from "../../../components/home/SuggestionCard";
import { COLORS } from "../../../constants/colors";

import LoadingScreen from "../../../components/LoadingScreen";

const { width: screenWidth } = Dimensions.get("window");

const carouselImages = [
  {
    id: "c1",
    image: {
      uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop",
    },
  },
  {
    id: "c2",
    image: {
      uri: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1740&auto=format&fit=crop",
    },
  },
  {
    id: "c3",
    image: {
      uri: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=1740&auto=format&fit=crop",
    },
  },
  {
    id: "c4",
    image: {
      uri: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1740&auto=format&fit=crop",
    },
  },
  {
    id: "c5",
    image: {
      uri: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1740&auto=format&fit=crop",
    },
  },
];

const serviceCategories = [
  { id: "s1", label: "Vui chơi & Trải nghiệm" },
  { id: "s2", label: "Xe khách" },
  { id: "s3", label: "Tự thuê xe" },
  { id: "s4", label: "Khách sạn" },
  { id: "s5", label: "Mục khác" },
];
const ITEM_WIDTH_PERCENTAGE_HOME = 0.6;
const ITEM_HEIGHT_CAROUSEL_TOTAL_HOME = 150;
const ITEM_SPACING_CAROUSEL_HOME = 15;
const ITEM_WIDTH_CAROUSEL = screenWidth * ITEM_WIDTH_PERCENTAGE_HOME;
const SNAP_INTERVAL = ITEM_WIDTH_CAROUSEL + ITEM_SPACING_CAROUSEL_HOME;
const PAGINATION_AREA_HEIGHT = 30;

export default function HomeScreen() {
  const router = useRouter();

  const loopedCarouselImages = [
    ...carouselImages,
    ...carouselImages,
    ...carouselImages,
  ];
  const initialIndex = carouselImages.length;

  const [activeTab, setActiveTab] = useState("Đề xuất");
  const [currentCarouselIndex, setCurrentCarouselIndex] =
    useState(initialIndex);
  const carouselRef = useRef(null);
  const [isCarouselManuallyScrolling, setIsCarouselManuallyScrolling] =
    useState(false);

  // State quản lý danh mục
  const [categories, setCategories] = useState([]);
  const [tours, setTours] = useState([]);
  const [locationTours, setLocationTours] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(COLORS.primary);
        StatusBar.setTranslucent(false);
      }
    }, [])
  );

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }
  }, []);

  useEffect(() => {
    if (isCarouselManuallyScrolling) return;

    const timer = setInterval(() => {
      if (!carouselRef.current) return;

      let nextIndex = currentCarouselIndex + 1;

      if (nextIndex >= loopedCarouselImages.length - 1) {
        nextIndex = initialIndex;
        carouselRef.current.scrollToIndex({
          index: nextIndex,
          animated: false,
        });
      } else {
        carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }

      setCurrentCarouselIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentCarouselIndex, isCarouselManuallyScrolling]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index ?? initialIndex;
      setCurrentCarouselIndex(visibleIndex);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleCarouselScrollBegin = () => {
    setIsCarouselManuallyScrolling(true);
  };

  const handleCarouselScrollEnd = () => {
    setTimeout(() => {
      setIsCarouselManuallyScrolling(false);
    }, 500);
  };

  const renderPagination = () => {
    const activeIndex = currentCarouselIndex % carouselImages.length;
    return (
      <View style={styles.paginationContainer}>
        {carouselImages.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.paginationDotBase,
              activeIndex === index
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  const handlePressDestination = async (item) => {
  setSelectedLocation(item._id);
  setSelectedLocationName(item.name);
  setLoading(true);
  try {
    setError(null);
    let toursData;

    // Kiểm tra xem danh mục có phải là "Tất cả" hay không
    if (item.name.toLowerCase() === 'tất cả' || item.isAllCategory) {
      console.log('Bắt đầu gọi API getTours để lấy tất cả tour');
      toursData = await getTours();
    } else {
      console.log('Bắt đầu gọi API getToursByLocation với cateID:', item._id);
      toursData = await getToursByLocation(item._id);
    }

    // Xử lý dữ liệu tour
    const processedTours = Array.isArray(toursData)
      ? toursData.map((tour) => ({
          ...tour,
          image:
            Array.isArray(tour.image) && tour.image.length > 0
              ? tour.image[0]
              : tour.image || 'https://via.placeholder.com/300',
        }))
      : toursData.data
      ? toursData.data.map((tour) => ({
          ...tour,
          image:
            Array.isArray(tour.image) && tour.image.length > 0
              ? tour.image[0]
              : tour.image || 'https://via.placeholder.com/300',
        }))
      : [];

    setLocationTours(processedTours);
    setActiveTab('Đề xuất');
  } catch (err) {
    console.error(
      item.name.toLowerCase() === 'tất cả'
        ? 'Lỗi khi gọi getTours:'
        : 'Lỗi khi gọi getToursByLocation:',
      err.response?.data || err.message
    );
    setError(
      item.name.toLowerCase() === 'tất cả'
        ? 'Không tìm thấy tour nào'
        : `Không tìm thấy tour cho ${item.name}`
    );
    setLocationTours([]);
  } finally {
    setLoading(false);
  }
};

  const handlePressSuggestion = (tourId) => {
    console.log("Điều hướng đến trip-detail với ID:", tourId);
    if (!tourId) {
      console.error(
        "LỖI: tourId không hợp lệ (undefined) nên không thể điều hướng!"
      );
      return;
    }

    router.push(`/trip-detail/${tourId}`);
  };
  const handlePressCategory = async (item) => {
    console.log("Chọn danh mục:", item.label);
  };

  const HomeHeaderContent = () => (
    <View style={styles.homeHeaderContentContainer}>
      <HeaderSearchBar />
      <PromoBanner />
    </View>
  );

  // Gọi API lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Bắt đầu gọi API getCategories');
        const response = await getCategories();
        //console.log('Dữ liệu categories trả về:', response);
        setCategories(Array.isArray(response) ? response : response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi gọi getCategories:', err);
        setError('Lỗi khi lấy danh sách categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
// gọi API lấy tour

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
       // console.log("Dữ liệu từ getTours:", data);

        const processedData = Array.isArray(data)
          ? data.map((tour) => ({
            ...tour,
            image:
              Array.isArray(tour.image) && tour.image.length > 0
                ? tour.image[0]
                : tour.image || "https://via.placeholder.com/300",
          }))
          : [];

        setTours(processedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Trả về trạng thái loading nếu đang tải dữ liệu
  if (loading) {
    return <LoadingScreen />;
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.rootContainer}>
      <HomeHeaderContent />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary, COLORS.white, COLORS.white]}
          locations={[0, 0.7, 0.7, 1]}
          style={styles.carouselSectionWithGradient}
        >
          <FlatList
            ref={carouselRef}
            data={loopedCarouselImages}
            keyExtractor={(_, index) => `carousel-item-${index}`}
            renderItem={({ item }) => <ImageCarouselCard item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            bounces={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            style={styles.carouselFlatListStyle}
            contentContainerStyle={{
              paddingHorizontal:
                (screenWidth - ITEM_WIDTH_CAROUSEL) / 2 -
                ITEM_SPACING_CAROUSEL_HOME / 2,
              paddingTop: 20,
            }}
            getItemLayout={(data, index) => ({
              length: SNAP_INTERVAL,
              offset: SNAP_INTERVAL * index,
              index,
            })}
            onScrollBeginDrag={handleCarouselScrollBegin}
            onMomentumScrollEnd={handleCarouselScrollEnd}
          />
          <View style={styles.paginationWrapperInGradient}>
            {renderPagination()}
          </View>
        </LinearGradient>

        <View style={styles.sectionWrapper}>
          <View style={styles.serviceCategoriesContainer}>
            {serviceCategories.map((item) => (
              <ServiceCategoryItem
                key={item.id}
                label={item.label}
                onPress={handlePressCategory}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionWrapper}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <DestinationChip
                destination={item}
                onPress={handlePressDestination}
                isSelected={selectedLocation === item._id}
              />
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContentPadding}
          />
        </View>

        <View style={styles.sectionWrapperWithBorderForSuggestions}>
          <View style={styles.tabBarContainer}>
            {["Đề xuất", "Gần đây"].map((tabName) => (
              <TouchableOpacity
                key={tabName}
                style={[
                  styles.tabItem,
                  activeTab === tabName && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab(tabName)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tabName && styles.activeTabText,
                  ]}
                >
                  {tabName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "Đề xuất" && (
            <FlatList
              data={selectedLocation ? locationTours : tours}
              renderItem={({ item }) => (
                <SuggestionCard
                  item={item}
                  onPress={() => handlePressSuggestion(String(item._id))}
                />
              )}
              keyExtractor={(item) => String(item._id)}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.suggestionListContent}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={5}
              removeClippedSubviews={true}
              getItemLayout={(_, index) => ({
              //getItemLayout={(data, index) => ({
                length: 260,
                offset: 260 * index,
                index,
              })}
              ListEmptyComponent={() => (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                    {selectedLocation
                      ? `Không có tour nào cho ${selectedLocationName}`
                      : "Không có tour nào để hiển thị"}
                  </Text>
                </View>
              )}
            />
          )}
          {activeTab === "Gần đây" && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Chưa có mục nào gần đây.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  homeHeaderContentContainer: {
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  carouselSectionWithGradient: {
    height: ITEM_HEIGHT_CAROUSEL_TOTAL_HOME + 20 + PAGINATION_AREA_HEIGHT,
    justifyContent: "space-between",
  },
  carouselFlatListStyle: {
    height: ITEM_HEIGHT_CAROUSEL_TOTAL_HOME,
  },
  paginationWrapperInGradient: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: (PAGINATION_AREA_HEIGHT - 8 - 5) / 2,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDotBase: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  paginationDotInactive: {
    backgroundColor: COLORS.inactiveTabDot || "#D3D3D3",
    width: 8,
  },
  sectionWrapper: {
    backgroundColor: COLORS.white,
  },
  serviceCategoriesContainer: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.categoryBorder || "#E0E0E0",
    marginHorizontal: 15,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  horizontalListContentPadding: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionWrapperWithBorderForSuggestions: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 0.8,
    borderColor: COLORS.lightBorder || "#EAEAEA",
    paddingBottom: 10,
  },
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  tabItem: {
    paddingHorizontal: 12,
    marginRight: 15,
    paddingTop: 8,
    paddingBottom: 12,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  suggestionListContent: {
    paddingHorizontal: 5,
    paddingTop: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 200,
    paddingHorizontal: 15,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
