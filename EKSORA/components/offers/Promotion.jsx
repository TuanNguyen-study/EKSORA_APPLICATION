import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { getToursByLocation } from "../../API/services/serverCategories";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getPromotion } from "../../API/services/servicesPromotion";
import { FavoriteContext } from "../../store/FavoriteContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Promotions() {
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.43;
  const IMAGE_HEIGHT = CARD_WIDTH * (3 / 4);

  const [loading, setLoading] = useState(true);
  const [tourId, setId] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const { likedTours, addFavorite, removeFavorite } = useContext(FavoriteContext);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await getPromotion();
        const filtered = response.filter((item) => item.tour_id);
        setPromotions(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách Promotion", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    const fetchToursByLocation = async () => {
      try {
        const response = await getToursByLocation();
        setId(response);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết", err);
      } finally {
        setLoading(false);
      }
    };
    fetchToursByLocation();
  }, []);

  const handleToggleLike = async (tourId) => {
    try {
      if (likedTours.includes(tourId)) {
        await removeFavorite(tourId);
      } else {
        await addFavorite(tourId);
      }
      console.log('Toggle like completed, likedTours:', likedTours);
    } catch (error) {
      console.error('Lỗi khi toggle like:', error);
      Alert.alert('Lỗi', 'Không thể thay đổi trạng thái yêu thích.');
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Image source={require("../../assets/images/imgOffer.png")} style={styles.headerIcon} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Ưu đãi đang diễn ra</Text>
        </View>

        <FlatList
          data={promotions}
          numColumns={2}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 60 }}
          renderItem={({ item }) => {
            const tour = item.tour_id;
            if (!tour || !Array.isArray(tour.image) || !tour.image[0] || !tour.price) return null;

            const discount = item.discount || 0;
            const discountPrice = (
              tour.price - (tour.price * discount) / 100
            ).toLocaleString("vi-VN");

            const isLiked = likedTours.includes(tour._id);

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(stack)/trip-detail/[id]",
                    params: { id: tour._id },
                  })
                }
              >
                <ImageBackground
                  source={{ uri: tour.image[0] }}
                  style={[styles.image, { height: IMAGE_HEIGHT }]}
                  imageStyle={{
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                  resizeMode="cover"
                >
                  <TouchableOpacity style={styles.heartIcon} onPress={() => handleToggleLike(tour._id)}>
                    <FontAwesome
                      name={isLiked ? "heart" : "heart-o"}
                      size={20}
                      color={isLiked ? "red" : "white"}
                    />
                  </TouchableOpacity>
                </ImageBackground>

                <Text style={styles.cardTitle}>{tour.name}</Text>

                <View style={styles.priceColumn}>
                  <View style={styles.saleBox}>
                    <Text style={styles.saleLabel}>Sale</Text>
                    <Text style={styles.discount}> -{discount}%</Text>
                  </View>
                  <Text style={styles.price}>{`${discountPrice} VND`}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => item._id || index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#0088dc",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    width: 100,
    height: 78,
    resizeMode: "contain",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: "1%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    justifyContent: "flex-end",
    padding: 6,
  },
  heartIcon: {
    alignSelf: "flex-end",
    borderRadius: 12,
    padding: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 6,
    color: "#333",
  },
  priceColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 4,
  },
  saleBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fce6e6",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  saleLabel: {
    fontSize: 10,
    color: "#e53935",
    marginRight: 2,
    fontWeight: "bold",
  },
  discount: {
    fontSize: 12,
    color: "#e53935",
    fontWeight: "bold",
  },
  price: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
});
