import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location'; 

// API Services
import {
  getCategories,
  getTours,
  getToursByLocation,
} from "../../../API/services/serverCategories";

// Components
import HeaderSearchBar from "../../../components/home/HeaderSearchBar";
import PromoBanner from "../../../components/home/PromoBanner";
import LoadingScreen from "../../../components/LoadingScreen";
import ImageCarousel from "../../../components/home/ImageCarousel";
import DestinationSection from "../../../components/home/DestinationSection";
import SuggestionTabs from "../../../components/home/SuggestionTabs";

// Constants
import { COLORS } from "../../../constants/colors";

export default function HomeScreen() {
  const router = useRouter();

  // State quản lý dữ liệu chính
  const [categories, setCategories] = useState([]);
  const [tours, setTours] = useState([]);
  const [locationTours, setLocationTours] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State mới cho chức năng "Gần Đây"
  const [nearbyTours, setNearbyTours] = useState([]);
  const [isFindingNearby, setIsFindingNearby] = useState(false);
  const [nearbyError, setNearbyError] = useState(null);

  // Effect để set style cho StatusBar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(COLORS.primary);
        StatusBar.setTranslucent(false);
      }
    }, [])
  );

  // Gọi API lấy danh mục và tour ban đầu
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesData, toursData] = await Promise.all([
          getCategories(),
          getTours(),
        ]);

        const allCategory = { _id: 'all', name: 'Tất cả', isAllCategory: true };
        const categoriesWithAll = [allCategory, ...(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [])];
        setCategories(categoriesWithAll);
        
        const processedTours = (Array.isArray(toursData) ? toursData : toursData.data || []).map((tour) => ({
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

    fetchData();
  }, []);
  
  // Xử lý khi người dùng chọn một địa điểm
  const handlePressDestination = async (item) => {
    if (item.isAllCategory) {
      setSelectedLocation(item._id);
      setSelectedLocationName(item.name);
      setLocationTours([]); 
      return;
    }

    setSelectedLocation(item._id);
    setSelectedLocationName(item.name);
    setLoading(true);
    try {
      setError(null);
      const toursData = await getToursByLocation(item._id);

      const processedTours = (Array.isArray(toursData) ? toursData : toursData.data || []).map((tour) => ({
        ...tour,
        image: tour.image?.[0] || 'https://via.placeholder.com/300',
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

  // Hàm xử lý khi tìm kiếm tour gần đây
  const fetchNearbyTours = async (location) => {
    setIsFindingNearby(true);
    setNearbyError(null);
    setNearbyTours([]);
    //console.log("--- Bắt đầu tìm tour gần đây ---");

    try {
      // BƯỚC 1: Lấy địa chỉ từ tọa độ
      const geocodedAddresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      //console.log("Địa chỉ nhận diện được:", geocodedAddresses[0]);

      if (!geocodedAddresses?.length) {
        throw new Error("Không thể xác định được địa chỉ của bạn.");
      }
      
      // Lấy tên Tỉnh/Thành phố (ưu tiên city, rồi đến region)
      const locationName = geocodedAddresses[0].city || geocodedAddresses[0].region;
      if (!locationName) {
         throw new Error("Không nhận diện được tỉnh/thành phố.");
      }

      // Xóa chữ "Thành phố" hoặc "Tỉnh" để so khớp dễ hơn
      const cleanedLocationName = locationName.replace(/Thành phố|Tỉnh/i, '').trim();
      //console.log(`Tên vị trí đã làm sạch: "${cleanedLocationName}"`);

      // BƯỚC 2: Tìm danh mục phù hợp
      //console.log("Đang so sánh với các danh mục:", categories.map(c => c.name));
      const foundCategory = categories.find(
        (cat) => !cat.isAllCategory && cleanedLocationName.toLowerCase().includes(cat.name.toLowerCase())
      );
      
      if (!foundCategory) {
        console.error("Không tìm thấy danh mục nào phù hợp!");
        throw new Error(`Rất tiếc, chúng tôi chưa có tour nào tại ${cleanedLocationName}.`);
      }

      //console.log(`Đã tìm thấy danh mục: "${foundCategory.name}" (ID: ${foundCategory._id})`);

      // BƯỚC 3: Lấy các tour theo danh mục đã tìm thấy
      const toursData = await getToursByLocation(foundCategory._id);
      
      const processedTours = (Array.isArray(toursData) ? toursData : toursData.data || []).map((tour) => ({
        ...tour,
        image: tour.image?.[0] || 'https://via.placeholder.com/300',
      }));

      if (processedTours.length === 0) {
        throw new Error(`Không tìm thấy tour nào cho ${foundCategory.name}.`);
      }

      //console.log(`Đã tìm thấy ${processedTours.length} tour. Đang cập nhật giao diện.`);
      setNearbyTours(processedTours);

    } catch (err) {
      console.error("Lỗi trong quá trình tìm tour gần đây:", err.message);
      setNearbyError(err.message);
      setNearbyTours([]); 
    } finally {
      setIsFindingNearby(false);
      //console.log("--- Kết thúc tìm tour gần đây ---");
    }
  };
  // Hàm logic chính để tìm tour gần đây
const handleFindNearbyTours = (location) => {
    if (!location) return;

    // Hiển thị hộp thoại hỏi người dùng
    Alert.alert(
      "Tìm Tour Gần Đây?", 
      "Chúng tôi đã tìm thấy vị trí của bạn. Bạn có muốn xem các tour ở gần đây không?", 
      [
        {
          text: "Để sau",
          onPress: () => console.log("Người dùng đã từ chối tìm tour."),
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => fetchNearbyTours(location),
        },
      ]
    );
  };
  // Xử lý khi người dùng chọn một tour đề xuất
  const handlePressSuggestion = (tourId) => {
    if (!tourId) {
      console.error("LỖI: tourId không hợp lệ, không thể điều hướng!");
      return;
    }
    router.push(`/trip-detail/${tourId}`);
  };

  if (loading && !tours.length) {
    return <LoadingScreen />;
  }

  if (error && !loading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <LinearGradient
          colors={[ '#2F80ED','#56CCF2','#FFFFFF']}
          locations={[0, 0.3, 0.8, 1]}
          style={styles.gradientSection}
        >
          <HeaderSearchBar />
          <ImageCarousel />
        </LinearGradient>
        
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ưu đãi tuyệt vời!</Text>
            <Image
              source={require('../../../assets/images/64ecbddcd5a89.png')}
              style={styles.decorativeImage}
            />
          </View>
          <PromoBanner />
        </View>

        <DestinationSection 
          categories={categories}
          selectedLocation={selectedLocation}
          onPressDestination={handlePressDestination}
        />

        <SuggestionTabs 
          // Props cho tab "Đề xuất"
          tours={tours}
          locationTours={locationTours}
          selectedLocation={selectedLocation}
          selectedLocationName={selectedLocationName}
          isLoading={loading}
          
          // Props cho tab "Gần đây"
          onFindNearby={handleFindNearbyTours}
          nearbyTours={nearbyTours}
          isFindingNearby={isFindingNearby}
          nearbyError={nearbyError}
          
          // Prop chung
          onPressSuggestion={handlePressSuggestion}
        />
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  decorativeImage: {
    width: 80,
    height: 50,
    resizeMode: 'cover',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});