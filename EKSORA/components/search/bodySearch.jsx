import React, { useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";

const dataByTab = {
  top: [
      {
    id: 1,
    title: 'Tour Đà Lạt 2 ngày 1 đêm',
    location: 'Đà lạt',
    price: '1,250,000',
    description: 'Khám phá vẻ đẹp của Đà Lạt với tour 2 ngày 1 đêm, bao gồm tham quan các điểm du lịch nổi tiếng và thưởng thức ẩm thực địa phương.',
    image: 'https://ik.imagekit.io/tvlk/blog/2023/01/canh-dep-da-lat-1.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2',
  },
  {
    id: 2,
    title: 'Tour Miền Tây 2 ngày 1 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    description: 'Khám phá vẻ đẹp của miền Tây sông nước với tour 2 ngày 1 đêm, bao gồm tham quan các vườn trái cây, chợ nổi và thưởng thức ẩm thực địa phương.', 
    image: 'https://baocantho.com.vn/image/fckeditor/upload/2022/20220404/images/I%25201(1).gif',
  },
  {
    id: 3,
    title: 'Tour Phú Quốc 2 ngày 3 đêm',
    location: 'Phú quốc',
    price: '1,850,000',
    description: 'Khám phá hòn đảo thiên đường Phú Quốc với tour 2 ngày 3 đêm, bao gồm các hoạt động vui chơi giải trí và tham quan các bãi biển đẹp.',
    image: 'https://eggyolk.vn/wp-content/uploads/2024/08/tu-a-z-kinh-nghiem-du-lich-phu-quoc-danh-cho-gia-dinh-202106222314162367.jpg',
  },
  {
    id: 4,
    title: 'Tour Đà Nẵng – Hội An – Huế',
    location: 'Việt nam',
    price: '3,750,000',
    description: 'Khám phá vẻ đẹp của miền Trung Việt Nam với tour kết hợp Đà Nẵng, Hội An và Huế trong 4 ngày 3 đêm, bao gồm tham quan các di sản văn hóa và thưởng thức ẩm thực đặc sắc.',
    image: 'https://moodhoian.vn/storage/photos/shares/H%E1%BB%99i%20An%20-%20%E2%80%9CTh%C3%A0nh%20ph%E1%BB%91%20c%E1%BB%A7a%20nh%E1%BB%AFng%20danh%20hi%E1%BB%87u%E2%80%9D%20hi%E1%BA%BFu%20kh%C3%A1ch%20b%E1%BA%ADc%20nh%E1%BA%A5t%20th%E1%BA%BF%20gi%E1%BB%9Bi/Pho-co-Hoi-An-feture.png',
  },
  {
    id: 5,
    title: 'Tour đảo phú quý 2 ngày 3 đêm',
    location: 'Phú quý',
    price: '1,850,000',
    description: 'Khám phá vẻ đẹp hoang sơ của đảo Phú Quý với tour 2 ngày 3 đêm, bao gồm các hoạt động lặn biển và tham quan các điểm du lịch nổi tiếng.',
    image: 'https://images.vietnamtourism.gov.vn/vn/images/2021/thang_7/0607.dao_phu_quy_-_noi_du_ngoan_hap_dan_va_day_tiem_nang_4.jpg',
  },
  {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    description: 'Khám phá vẻ đẹp của miền Tây sông nước với tour 3 ngày 2 đêm, bao gồm tham quan các vườn trái cây, chợ nổi và thưởng thức ẩm thực địa phương.',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
  {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    description: 'Khám phá vẻ đẹp của miền Tây sông nước với tour 3 ngày 2 đêm, bao gồm tham quan các vườn trái cây, chợ nổi và thưởng thức ẩm thực địa phương.',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
 
  ],
  trend: [
    {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    description: 'Khám phá vẻ đẹp của miền Tây sông nước với tour 3 ngày 2 đêm, bao gồm tham quan các vườn trái cây, chợ nổi và thưởng thức ẩm thực địa phương.',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
  ],
  visit: [
      {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
   {
    id: 6,
    title: 'Tour Miền Tây 3 ngày 2 đêm',
    location: 'Bến tre',
    price: '1,750,000',
    image: 'https://cand.com.vn/Files/Image/honghai/2020/05/26/93c02255-98e7-412c-8f55-736532288485.jpg',
  },
  ],
};



export default function Body() {
  const [activeTab, setActiveTab] = useState("top");
  const tours = dataByTab[activeTab];

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
            <Image source={{ uri: item.image }} style={styles.tourImage} />
            <View style={styles.tourContent}>
              <Text style={styles.tourTitle}>{item.title}</Text>
              
              <Text style={styles.tourLocation}>{item.location}</Text>
              <Text style={styles.tourPrice}>{item.price}</Text>
            </View>
            <View style={styles.tourRank}>
              <Text style={styles.tourRankText}>{item.id}</Text>
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
    color: COLORS.primary, // xanh dương
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
    color: COLORS.primary, // xanh dương
    fontWeight: "bold",
  },

  tourRank: {
    backgroundColor: COLORS.primary, // xanh dương
    borderRadius: 12,
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