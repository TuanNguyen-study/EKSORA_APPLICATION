import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// API Services
import {
  getCategories,
  getTours,
  getToursByLocation,
} from "../../../API/services/serverCategories";

// <<< THAY ĐỔI COMPONENT >>>
import DestinationSection from "../../../components/home/DestinationSection";
import HeaderSearchBar from "../../../components/home/HeaderSearchBar";
import ImageCarousel from "../../../components/home/ImageCarousel";
import PromoBanner from "../../../components/home/PromoBanner";
import SuggestionsSection from "../../../components/home/SuggestionsSection";
import LoadingScreen from "../../../components/LoadingScreen";

// Constants
import { COLORS } from "../../../constants/colors";

export default function HomeScreen() {
  const router = useRouter();

  // State quản lý dữ liệu chính
  const [categories, setCategories] = useState([]);
  const [tours, setTours] = useState([]);
  const [locationTours, setLocationTours] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedLocationName, setSelectedLocationName] = useState("Tất cả");
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

  // Gọi API lấy danh mục và tour ban đầu chỉ một lần
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [categoriesData, toursData] = await Promise.all([
          getCategories(),
          getTours(),
        ]);

        const allCategory = { _id: "all", name: "Tất cả", isAllCategory: true };
        const categoriesWithAll = [
          allCategory,
          ...(Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.data || []),
        ];
        setCategories(categoriesWithAll);

        const rawTours = Array.isArray(toursData)
          ? toursData
          : toursData.data || [];
        const processedTours = rawTours
          .filter((tour) => tour && tour.price > 0)
          .map((tour) => ({
            ...tour,
            image: tour.image?.[0] || "https://via.placeholder.com/300",
          }));

        setTours(processedTours);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Xử lý khi người dùng chọn một địa điểm
  const handlePressDestination = async (item) => {
    // Nếu đã chọn rồi thì không fetch lại
    if (selectedLocation === item._id) return;

    setLoading(true); // Chỉ bật loading cho phần danh sách tour
    setSelectedLocation(item._id);
    setSelectedLocationName(item.name);

    if (item.isAllCategory) {
      setLocationTours([]); // Xóa danh sách tour theo địa điểm
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const toursData = await getToursByLocation(item._id);
      const processedTours = (
        Array.isArray(toursData) ? toursData : toursData.data || []
      )
        .filter((tour) => tour && tour.price > 0) // Lọc bỏ tour có giá 0 đồng
        .map((tour) => ({
          ...tour,
          image: tour.image?.[0] || "https://via.placeholder.com/300",
        }));
      setLocationTours(processedTours);
    } catch (err) {
      console.error("Lỗi khi lấy tour theo địa điểm:", err);
      setError(`Không tìm thấy tour cho ${item.name}`);
      setLocationTours([]);
    } finally {
      setLoading(false);
    }
  };

  // <<< HÀM MỚI: XỬ LÝ ĐIỀU HƯỚNG SANG TRANG GẦN ĐÂY >>>
  const handleNavigateToNearby = () => {
    router.push("/nearby");
  };

  // Xử lý khi người dùng chọn một tour đề xuất
  const handlePressSuggestion = (tourId) => {
    if (!tourId) {
      console.error("LỖI: tourId không hợp lệ, không thể điều hướng!");
      return;
    }
    router.push(`/trip-detail/${tourId}`);
  };

  // Hiển thị màn hình loading chính khi chưa có dữ liệu lần đầu
  if (loading && !tours.length && !categories.length) {
    return <LoadingScreen />;
  }

  if (error && !tours.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#2F80ED", "#56CCF2", "#F5F5F5"]}
      locations={[0, 0.6, 0.8]}
      style={styles.rootContainer}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <HeaderSearchBar />

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ưu đãi tuyệt vời!</Text>
            <Image
              source={require("../../../assets/images/64ecbddcd5a89.png")}
              style={styles.decorativeImage}
            />
          </View>
          <PromoBanner />
        </View>
        <ImageCarousel />
        <DestinationSection
          categories={categories}
          selectedLocation={selectedLocation}
          onPressDestination={handlePressDestination}
          onPressNearby={handleNavigateToNearby}
        />

        <SuggestionsSection
          tours={tours}
          locationTours={locationTours}
          selectedLocation={selectedLocation}
          selectedLocationName={selectedLocationName}
          isLoading={loading}
          onPressSuggestion={handlePressSuggestion}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  gradientSection: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  decorativeImage: {
    width: 80,
    height: 50,
    resizeMode: "cover",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
