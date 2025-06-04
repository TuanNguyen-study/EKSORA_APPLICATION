import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";

import { COLORS } from "../../../constants/colors";
import HeaderSearchBar from "../../../components/home/HeaderSearchBar";
import PromoBanner from "../../../components/home/PromoBanner";
import ImageCarouselCard from "../../../components/home/ImageCarouselCard";
import ServiceCategoryItem from "../../../components/home/ServiceCategoryItem";
import DestinationChip from "../../../components/home/DestinationChip";
import SuggestionCard from "../../../components/home/SuggestionCard";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// --- Mock Data ---
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
const popularDestinations = [
  {
    id: "d1",
    name: "TP Hồ Chí Minh",
    image: {
      uri: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=1740&auto=format&fit=crop",
    },
  },
  {
    id: "d2",
    name: "TP Nha Trang",
    image: {
      uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop",
    },
  },
  {
    id: "d3",
    name: "Đà Nẵng",
    image: {
      uri: "https://images.unsplash.com/photo-1503160865287-b054e0750e03?q=80&w=1804&auto=format&fit=crop",
    },
  },
  {
    id: "d4",
    name: "Hà Nội",
    image: {
      uri: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1740&auto=format&fit=crop",
    },
  },
];
const suggestedItems = [
  {
    id: "sg1",
    title:
      "Tour Long An 2 ngày 1 đêm - Nghỉ dưỡng và phục hồi sức khỏe ở KDL Cánh Đồng Bất Tận",
    image: {
      uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop",
    },
    rating: 4.8,
    reviews: "1,600",
    originalPrice: 1550000,
    price: 1250000,
    discount: 25,
  },
  {
    id: "sg2",
    title: "Combo Khách Sạn 4 Sao + Vé Máy Bay Đà Nẵng Hội An - 4 Ngày 3 Đêm",
    image: {
      uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop",
    },
    rating: 4.8,
    reviews: "1,600",
    originalPrice: 2550000,
    price: 2250000,
    discount: 25,
  },
  {
    id: "sg3",
    title: "Kỳ nghỉ dưỡng tại Phú Quốc villa hướng biển, giá siêu ưu đãi",
    image: {
      uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop",
    },
    rating: 4.9,
    reviews: "2,100",
    price: 3500000,
    discount: 15,
  },
  {
    id: "sg4",
    title: "Khám phá vẻ đẹp Tokyo truyền thống và hiện đại 5N4Đ",
    image: {
      uri: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1740&auto=format&fit=crop",
    },
    rating: 4.7,
    reviews: "980",
    originalPrice: 22000000,
    price: 18500000,
    discount: 20,
  },
];

const ITEM_WIDTH_PERCENTAGE_HOME = 0.6;
const ITEM_HEIGHT_CAROUSEL_TOTAL_HOME = 150;
const ITEM_SPACING_CAROUSEL_HOME = 15;
const ITEM_WIDTH_CAROUSEL = screenWidth * ITEM_WIDTH_PERCENTAGE_HOME;
const SNAP_INTERVAL = ITEM_WIDTH_CAROUSEL + ITEM_SPACING_CAROUSEL_HOME;
const PAGINATION_AREA_HEIGHT = 30;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Đề xuất");
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isCarouselManuallyScrolling, setIsCarouselManuallyScrolling] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(COLORS.primary);
        StatusBar.setTranslucent(false);
      }
    }, [])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      if (
        visibleIndex !== null &&
        visibleIndex !== undefined &&
        visibleIndex < carouselImages.length &&
        visibleIndex !== currentCarouselIndex
      ) {
        setCurrentCarouselIndex(visibleIndex);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Tự động chuyển carousel
  useEffect(() => {
    if (carouselImages.length === 0 || isCarouselManuallyScrolling) return;

    const timer = setInterval(() => {
      if (carouselRef.current) {
        let nextIndex = (currentCarouselIndex + 1) % carouselImages.length;
        carouselRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [
    currentCarouselIndex,
    carouselImages.length,
    isCarouselManuallyScrolling,
  ]);

  const handlePressDestination = (item) =>
    console.log("Chọn điểm đến:", item.name);
  const handlePressSuggestion = (item) =>
    console.log("Chọn gợi ý:", item.title);

  const HomeHeaderContent = () => (
    <View style={styles.homeHeaderContentContainer}>
      <HeaderSearchBar />
      <PromoBanner />
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {carouselImages.map((_, index) => (
        <View
          key={`dot-${index}`}
          style={[
            styles.paginationDotBase,
            currentCarouselIndex === index
              ? styles.paginationDotActive
              : styles.paginationDotInactive,
          ]}
        />
      ))}
    </View>
  );

  const handleCarouselScrollBegin = () => {
    setIsCarouselManuallyScrolling(true);
  };

  const handleCarouselScrollEnd = () => {
    setTimeout(() => {
      setIsCarouselManuallyScrolling(false);
    }, 500);
  };

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
            data={carouselImages}
            renderItem={({ item }) => <ImageCarouselCard item={item} />}
            keyExtractor={(item) => item.id}
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
                onPress={() => console.log("Selected category:", item.label)}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionWrapper}>
          <FlatList
            data={popularDestinations}
            renderItem={({ item }) => (
              <DestinationChip
                destination={item}
                onPress={handlePressDestination}
              />
            )}
            keyExtractor={(item) => item.id}
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
              data={suggestedItems}
              renderItem={({ item }) => (
                <SuggestionCard item={item} onPress={handlePressSuggestion} />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.suggestionListContent}
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
