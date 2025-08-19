import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import PromotionItem from "./PromotionItem";

// API và Context
import { getPromotion } from "../../../API/services/servicesPromotion";
import { FavoriteContext } from "../../../store/FavoriteContext";

// Hằng số cho style
const GRID_PADDING = 16;

export default function Promotions() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  // Vẫn cần context ở đây để biết item nào đã được like và để truyền hàm xử lý xuống
  const { likedTours, addFavorite, removeFavorite } =
    useContext(FavoriteContext);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const promotionResponse = await getPromotion();
        const validPromotions = promotionResponse.filter(
          (item) =>
            item._id &&
            item.tour_id &&
            Array.isArray(item.tour_id.image) &&
            item.tour_id.image.length > 0 &&
            item.tour_id.price
        );
        setPromotions(validPromotions);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu Promotions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Hàm này sẽ được truyền xuống cho từng PromotionItem
  const handleToggleLike = async (tourId) => {
    try {
      if (likedTours.includes(tourId)) {
        await removeFavorite(tourId);
      } else {
        await addFavorite(tourId);
      }
    } catch (error) {
      console.error("Lỗi khi toggle like:", error);
      Alert.alert("Lỗi", "Không thể thay đổi trạng thái yêu thích.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0087CA" />
      </View>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Image
        source={require("../../../assets/images/imgOffer.png")}
        style={styles.promoIcon}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Ưu đãi đang diễn ra</Text>
      </View>

      <View style={styles.gridContainer}>
        {promotions.map((item) => {
          // Xác định xem item này đã được "like" hay chưa
          const isLiked = likedTours.includes(item.tour_id._id);

          return (
            <PromotionItem
              key={item._id}
              item={item}
              isLiked={isLiked}
              onToggleLike={handleToggleLike} // Truyền hàm xử lý xuống
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  promoIcon: {
    position: "absolute",
    top: -15,
    right: 5,
    width: 100,
    height: 78,
    resizeMode: "contain",
    zIndex: 1,
  },
  header: {
    backgroundColor: "#0087CA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: GRID_PADDING,
  },
  cardHeader: {
    height: 200,
    justifyContent: "space-between",
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 20,
  },
});
