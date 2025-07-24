// components/home/ImageCarousel.js

import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import ImageCarouselCard from "./ImageCarouselCard";
import { COLORS } from "../../constants/colors";

const { width: screenWidth } = Dimensions.get("window");

// Dữ liệu và hằng số có thể được di chuyển ra file riêng (vd: constants/data.js)
const carouselImages = [
  // ... (giữ nguyên mảng carouselImages)
  { id: "c1", image: { uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop" } },
  { id: "c2", image: { uri: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1740&auto=format&fit=crop" } },
  { id: "c3", image: { uri: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=1740&auto=format&fit=crop" } },
  { id: "c4", image: { uri: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1740&auto=format&fit=crop" } },
  { id: "c5", image: { uri: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1740&auto=format&fit=crop" } },
];

const ITEM_WIDTH_PERCENTAGE = 0.6;
const ITEM_HEIGHT = 150;
const ITEM_SPACING = 15;
const ITEM_WIDTH = screenWidth * ITEM_WIDTH_PERCENTAGE;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;
const PAGINATION_AREA_HEIGHT = 30;

const ImageCarousel = () => {
  const loopedCarouselImages = [
    ...carouselImages,
    ...carouselImages,
    ...carouselImages,
  ];
  const initialIndex = carouselImages.length;

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(initialIndex);
  const carouselRef = useRef(null);
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);

  // Scroll đến vị trí ban đầu
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, []);

  // Tự động cuộn
  useEffect(() => {
    if (isManuallyScrolling) return;

    const timer = setInterval(() => {
      if (!carouselRef.current) return;
      let nextIndex = currentCarouselIndex + 1;
      
      if (nextIndex >= loopedCarouselImages.length -1) {
          nextIndex = initialIndex;
          carouselRef.current.scrollToIndex({ index: nextIndex, animated: false });
      } else {
          carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
      
      setCurrentCarouselIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentCarouselIndex, isManuallyScrolling]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentCarouselIndex(viewableItems[0].index ?? initialIndex);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleScrollBegin = () => setIsManuallyScrolling(true);
  const handleScrollEnd = () => setTimeout(() => setIsManuallyScrolling(false), 500);

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

  return (
    <View style={styles.carouselSection}>
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
          paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2 - ITEM_SPACING / 2,
          paddingTop: 20,
        }}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
      />
      <View style={styles.paginationWrapper}>{renderPagination()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselSection: {
    height: ITEM_HEIGHT + 20 + PAGINATION_AREA_HEIGHT,
    justifyContent: "space-between",
    backgroundColor: 'transparent',
  },
  carouselFlatListStyle: {
    height: ITEM_HEIGHT,
  },
  paginationWrapper: {
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
});

export default ImageCarousel;