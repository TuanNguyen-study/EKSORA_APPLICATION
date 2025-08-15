import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import ImageCarouselCard from "./ImageCarouselCard";
import { COLORS } from "../../constants/colors";
import { getTours } from "../../API/services/serverCategories";

const { width: screenWidth } = Dimensions.get("window");

const ITEM_WIDTH_PERCENTAGE = 0.6;
const ITEM_HEIGHT = 150;
const ITEM_SPACING = 15;
const ITEM_WIDTH = screenWidth * ITEM_WIDTH_PERCENTAGE;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;
const PAGINATION_AREA_HEIGHT = 30;

const ImageCarousel = () => {
  const [carouselImages, setCarouselImages] = useState([]);

  // Fetch tour images từ API
  useEffect(() => {
    const fetchTourImages = async () => {
      try {
        const response = await getTours();
        const tours = response?.data || response;

        if (Array.isArray(tours) && tours.length > 0) {
          // Lấy 5 tour đầu tiên và chuyển đổi thành format carousel
          const tourImages = tours
            .slice(0, 10)
            .map((tour) => ({
              id: tour._id || tour.id,
              image: { uri: tour.image?.[0] || "" }, // Lấy ảnh đầu tiên từ mảng image
              tourData: tour, // Lưu thêm data tour để dùng khi navigate
            }))
            .filter((img) => !!img.image.uri);

          // console.log("Tour images loaded:", tourImages); // Debug log
          setCarouselImages(tourImages);
        }
      } catch (error) {
        // console.error("Error fetching tour images:", error);
        // Fallback data nếu API lỗi
        setCarouselImages([
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
        ]);
      }
    };

    fetchTourImages();
  }, []);

  const loopedCarouselImages = [
    ...carouselImages,
    ...carouselImages,
    ...carouselImages,
  ];
  const initialIndex = carouselImages.length;

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);

  // Scroll đến vị trí ban đầu khi có dữ liệu
  useEffect(() => {
    if (carouselRef.current && carouselImages.length > 0) {
      carouselRef.current.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
      setCurrentCarouselIndex(initialIndex);
    }
  }, [carouselImages, initialIndex]);

  // Tự động cuộn
  useEffect(() => {
    if (isManuallyScrolling || carouselImages.length === 0) return;

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
    }, 5000);

    return () => clearInterval(timer);
  }, [currentCarouselIndex, isManuallyScrolling]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentCarouselIndex(viewableItems[0].index ?? initialIndex);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleScrollBegin = () => setIsManuallyScrolling(true);
  const handleScrollEnd = () =>
    setTimeout(() => setIsManuallyScrolling(false), 500);

  return (
    <View style={styles.carouselSection}>
      <FlatList
        ref={carouselRef}
        data={loopedCarouselImages}
        keyExtractor={(_, index) => `carousel-item-${index}`}
        renderItem={({ item, index }) => {
          const activeIndex = currentCarouselIndex % carouselImages.length;
          const itemIndex = index % carouselImages.length;
          const isActive = activeIndex === itemIndex;

          return <ImageCarouselCard item={item} isActive={isActive} />;
        }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  carouselSection: {
    height: ITEM_HEIGHT + 50,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  carouselFlatListStyle: {
    height: ITEM_HEIGHT,
  },
});

export default ImageCarousel;
