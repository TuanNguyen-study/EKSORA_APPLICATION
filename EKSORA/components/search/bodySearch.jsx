import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";
import { getTours } from "../../API/services/serverCategories";



export default function Body() {
  const [activeTab, setActiveTab] = useState("top");
  const [tours, setTours] = useState([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response);
        setLoading(false);
      } catch (error) {
        setError('Lỗi khi lấy danh sách categories');
        setLoading(false);
      }
    };

    fetchTours();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      {/* Header tab cố định */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab("top")}>
          <Text style={activeTab === "top" ? styles.tabActive : styles.tabInactive}>Top tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("trend")}>
          <Text style={activeTab === "trend" ? styles.tabActive : styles.tabInactive}>Điểm đến xu hướng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("visit")}>
          <Text style={activeTab === "visit" ? styles.tabActive : styles.tabInactive}>Top điểm tham quan</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList danh sách tour */}
      <FlatList
        data={tours}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tourCard}>
            <Image source={{ uri: item.image[0] }} style={styles.tourImage} />
            <View style={styles.tourContent}>
              <Text style={styles.tourTitle}>{item.title}</Text>

              <Text style={styles.tourLocation}>{item.location}</Text>
              <Text style={styles.tourProvince}>{item.province}</Text>
              <Text style={styles.tourPrice}>{item.price}</Text>


            </View>
            <View style={styles.tourRank}>
              <Text style={styles.tourRankText}>{item.rating}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  tabActive: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },

  tabInactive: {
    color: "#999",
    fontSize: 16,
  },

  tourCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  tourImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  tourContent: {
    flex: 1,
    marginLeft: 12,
  },

  tourTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  tourLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },

  tourPrice: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "bold",
    marginTop: '15',
  },

  tourProvince: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: '10',
    fontWeight: "black",
  },

  tourRank: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  tourRankText: {
    color: "#fff",
    fontWeight: "bold",
  },
})