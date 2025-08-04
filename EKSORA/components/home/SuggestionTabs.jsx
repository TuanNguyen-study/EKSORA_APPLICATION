import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import SuggestionCard from "./SuggestionCard";
import CurrentLocationMap from "./CurrentLocationMap"; 
import { COLORS } from "../../constants/colors";

const SuggestionTabs = ({
  tours, locationTours, selectedLocation, selectedLocationName, onPressSuggestion, isLoading,
  onFindNearby, nearbyTours, isFindingNearby, nearbyError
}) => {
  const [activeTab, setActiveTab] = useState("Đề xuất");
  const [initialSearchTriggered, setInitialSearchTriggered] = useState(false);

  // --- LOGIC CHO TAB ĐỀ XUẤT ---
  const dataToRender = selectedLocation === 'all' || !selectedLocation ? tours : locationTours;
  const renderEmptyList = () => {
    if (isLoading) return <View style={styles.emptyStateContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          {selectedLocation && selectedLocation !== 'all'
            ? `Không có tour nào cho ${selectedLocationName}`
            : "Không có tour nào để hiển thị"}
        </Text>
      </View>
    );
  };

  // --- CẤU TRÚC LẠI HOÀN TOÀN LOGIC CHO TAB GẦN ĐÂY ---
  const renderNearbyContent = () => {
    // Hàm này được truyền cho bản đồ. Bản đồ sẽ gọi nó khi tìm thấy vị trí.
    const handleLocationFound = (location) => {
        if (!initialSearchTriggered) {
            onFindNearby(location);
            setInitialSearchTriggered(true);
        }
    }

    return (
      // Container này sẽ chứa bản đồ và các lớp phủ trạng thái
      <View style={styles.nearbyContainer}>
        <CurrentLocationMap
          // 1. Truyền hàm để bản đồ gọi khi có vị trí
          onLocationFound={handleLocationFound}
          // 2. Truyền danh sách tour gần đây để bản đồ vẽ marker
          tourData={nearbyTours}
          // 3. Truyền hàm điều hướng để bản đồ gọi khi người dùng nhấn marker
          onMarkerPress={onPressSuggestion}
        />
        
        {/* Lớp phủ hiển thị trạng thái đang tìm kiếm */}
        {isFindingNearby && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={COLORS.white} />
            <Text style={styles.overlayText}>Đang tìm các tour gần bạn...</Text>
          </View>
        )}

        {/* Lớp phủ hiển thị lỗi (nếu có) */}
        {nearbyError && !isFindingNearby && (
           <View style={styles.overlay}>
             <Text style={styles.overlayText}>{nearbyError}</Text>
           </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.tabBarContainer}>
        {["Đề xuất", "Gần đây"].map((tabName) => (
          <TouchableOpacity
            key={tabName}
            style={[styles.tabItem, activeTab === tabName && styles.activeTabItem]}
            onPress={() => setActiveTab(tabName)}
          >
            <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        {activeTab === "Đề xuất" && (
          <FlatList
            data={dataToRender}
            renderItem={({ item }) => (
              <SuggestionCard item={item} onPress={() => onPressSuggestion(String(item._id))} />
            )}
            keyExtractor={(item) => String(item._id)}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.suggestionListContent}
            ListEmptyComponent={renderEmptyList}
          />
        )}
        
        {activeTab === "Gần đây" && renderNearbyContent()}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: COLORS.white, marginHorizontal: 15, marginBottom: 15,
    borderRadius: 12, borderWidth: 0.8, borderColor: COLORS.lightBorder || "#EAEAEA",
    flex: 1, 
  },
  tabBarContainer: {
    flexDirection: "row", paddingHorizontal: 15, paddingTop: 15,
  },
  tabItem: {
    paddingHorizontal: 12, marginRight: 15, paddingTop: 8, paddingBottom: 12,
  },
  activeTabItem: {
    borderBottomWidth: 3, borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16, color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary, fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    minHeight: 500, 
  },
  suggestionListContent: {
    paddingHorizontal: 5, paddingTop: 15,
  },
  emptyStateContainer: {
    justifyContent: "center", alignItems: "center", paddingVertical: 40, minHeight: 200, paddingHorizontal: 15,
  },
  emptyStateText: {
    fontSize: 16, color: COLORS.textSecondary, textAlign: 'center',
  },
  // Style cho tab "Gần đây"
  nearbyContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden', // Bắt buộc để bo góc hoạt động với bản đồ
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Đảm bảo lớp phủ nằm trên bản đồ
  },
  overlayText: {
    color: COLORS.white, fontSize: 16, fontWeight: 'bold',
    marginTop: 10, textAlign: 'center', paddingHorizontal: 20,
  },
});

export default SuggestionTabs;