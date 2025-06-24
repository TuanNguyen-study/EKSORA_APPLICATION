import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { getTours } from "../../API/services/serverCategories";
import { getToursByLocation } from "../../API/services/serverCategories";
import { router } from "expo-router";

export default function Promotions({ onPress }) {

  // Lấy kích thước màn hình
  const { width } = Dimensions.get('window');

  // Cập nhật CARD_WIDTH và IMAGE_HEIGHT để linh hoạt với kích thước màn hình
  const CARD_WIDTH = width * 0.43;
  const IMAGE_HEIGHT = CARD_WIDTH * (3 / 4);

  const [loading, setLoading] = useState(true);
  const [tour, setTours] = useState([]);
  const [tourId, setId] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Lỗi khi lấy danh sách tours", err);
      }
    };

    fetchTours();
  }, []);



  useEffect(() => {
    const fetchToursByLocation = async () => {
      try {
        const response = await getToursByLocation();
        setId(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Lỗi khi lấy chi tiết", err);
      }
    };

    fetchToursByLocation();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Image source={require("../../assets/images/imgOffer.png")} style={styles.headerIcon} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Ưu đãi đang diễn ra</Text>
        </View>

        {/* Danh sách ưu đãi */}
        <FlatList
          data={tour}
          numColumns={2}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          renderItem={({ item }) => {
            const discountPrice = (item.price - (item.price * 15) / 100).toLocaleString('vi-VN');

            return (

              <TouchableOpacity style={styles.card} onPress={() => router.push({
                pathname: "/(stack)/trip-detail/[id]",
                params: { id: item._id }
              
              })}>
                <ImageBackground source={{ uri: item.image[0] }} style={styles.image}>
                  <TouchableOpacity style={styles.heartIcon}>
                    <EvilIcons name="heart" size={24} color="black" />
                  </TouchableOpacity>
                </ImageBackground>

                <Text style={styles.cardTitle}>{item.name}</Text>

                <View style={styles.priceRow}>
                  <View style={styles.saleBox}>
                    <Text style={styles.saleLabel}>Sale</Text>
                    <Text style={styles.discount}> - 15%</Text>
                  </View>
                  <Text style={styles.price}>{`${discountPrice} VND`}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
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
    width: "100%",
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 6,
  },
  heartIcon: {
    alignSelf: "flex-end",
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    padding: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 6,
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 6,
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