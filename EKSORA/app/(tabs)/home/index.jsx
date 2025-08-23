import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from "react-native";

// API Services
import {
  getCategories,
  getTours,
  getToursByLocation,
} from "../../../API/services/serverCategories";

// Components
import DestinationSection from "../../../components/home/DestinationSection";
import HeaderSearchBar from "../../../components/home/HeaderSearchBar";
import ImageCarousel from "../../../components/home/ImageCarousel";
import PromoBanner from "../../../components/home/PromoBanner";
import SuggestionsSection from "../../../components/home/SuggestionsSection";
import LoadingScreen from "../../../components/LoadingScreen";

// Constants
import { COLORS } from "../../../constants/colors";

const { width, height } = Dimensions.get("window");

// ======================== PARTICLE (CHẤM SÁNG) ========================
const ParticleView = () => {
  const animatedValues = useRef(
    Array.from({ length: 18 }, () => ({
      translateY: new Animated.Value(height + 50),
      translateX: new Animated.Value(Math.random() * width),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(Math.random() * 0.5 + 0.7),
    }))
  ).current;

  useEffect(() => {
    animatedValues.forEach((particle, index) => {
      const animateParticle = () => {
        particle.translateY.setValue(height + 50);
        particle.translateX.setValue(Math.random() * width);
        particle.opacity.setValue(0);
        particle.scale.setValue(Math.random() * 0.5 + 0.7);

        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(particle.translateY, {
              toValue: -50,
              duration: 6000 + Math.random() * 3000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: Math.random() * width,
              duration: 6000 + Math.random() * 3000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => animateParticle()); // gọi lại ngay khi xong, liên tục
      };

      animateParticle(); // chạy ngay khi load
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {animatedValues.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: "rgba(255,255,255,0.85)",
              width: 4,
              height: 4,
              borderRadius: 2,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ======================== MAIN HOME SCREEN ========================
export default function HomeScreen() {
  const router = useRouter();

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

  const handlePressDestination = async (item) => {
    if (selectedLocation === item._id) return;

    setLoading(true);
    setSelectedLocation(item._id);
    setSelectedLocationName(item.name);

    if (item.isAllCategory) {
      setLocationTours([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const toursData = await getToursByLocation(item._id);
      const processedTours = (
        Array.isArray(toursData) ? toursData : toursData.data || []
      ).map((tour) => ({
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

  const handleNavigateToNearby = () => {
    router.push("/nearby");
  };

  const handlePressSuggestion = (tourId) => {
    if (!tourId) {
      console.error("LỖI: tourId không hợp lệ!");
      return;
    }
    router.push(`/trip-detail/${tourId}`);
  };

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
    <View style={styles.rootContainer}>
      {/* Nền gradient và hiệu ứng chấm sáng đứng im */}
    <LinearGradient
  colors={[
    "#2a6ee4ff", // xanh đậm đầu
    "#4d88eaff", // xanh vừa
    "#7babffff", // xanh nhạt
    "#9aceffff", // nền sáng cuối
  ]}
  locations={[0, 0.3, 0.65, 1]} // chia tỷ lệ đều hơn
  style={styles.fixedBackground}
/>
<ParticleView />


      {/* ScrollView chỉ cuộn nội dung, nền giữ nguyên */}
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
    </View>
  );
}

// ======================== STYLES ========================
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fixedBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent", // Đảm bảo nền trong suốt
    zIndex: 1,
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
  particle: {
    position: "absolute",
  },
  shootingStar: {
    position: "absolute",
    left: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 0,
  },
  starCore: {
    width: 5,
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 2.5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
  starTail: {
    width: 45,
    height: 3,
    backgroundColor: "#fff",
    marginLeft: -2,
    opacity: 0.8,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
});
