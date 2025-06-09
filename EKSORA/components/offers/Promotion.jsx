import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useEffect } from "react";
import { getPromotion } from "../../API/services/servicesPromotion";

// Dữ liệu ưu đãi


// const data = new Array(8).fill({
//   title: "Combo Khách Sạn 4 Sao + Vé Máy Bay Đà Nẵng Hội An 4 Ngày 3 Đêm",
//   price: "Từ ₫ 2,250,000",
//   discount: "15%",
//   image: require("../../assets/images/uudai.png"),
// });


export default function Promotions() {
  const [promotion, setPromotion] = useState([]);
  const [loading, setLoading] = useState(true);

  //api 
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await getPromotion();  
        setPromotion(response);  
        setLoading(false);  
      } catch (err) {
        setError('Lỗi khi lấy danh sách categories');
        setLoading(false);
      }
    };

    fetchPromotion();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Image
        source={require("../../assets/images/imgOffer.png")}
        style={styles.headerIcon}
      />
      <View style={styles.container}>
        {/* Header với nền xanh */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Ưu đãi đang diễn ra</Text>
        </View>

        {/* Danh sách ưu đãi */}
        <FlatList
          data={promotion}
          numColumns={2}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <ImageBackground source={item.image} style={styles.image}>
                <TouchableOpacity style={styles.heartIcon}>
                  <EvilIcons name="heart" size={24} color="black" />
                </TouchableOpacity>
              </ImageBackground>

              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.priceRow}>
                <View style={styles.saleBox}>
                  <Text style={styles.saleLabel}>Sale</Text>
                  <Text style={styles.discount}>-{item.discount}</Text>
                </View>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </View>
          )}
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#0088dc",
  },
  tabText: {
    color: "#333",
    fontSize: 14,
  },
  tabTextActive: {
    color: "white",
    fontWeight: "bold",
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
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
