import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import SuggestionCard from "./SuggestionCard";
import { COLORS } from "../../constants/colors";

// Component này giờ chỉ tập trung vào việc hiển thị danh sách tour đề xuất
const SuggestionsSection = ({
  tours,
  locationTours,
  selectedLocation,
  selectedLocationName,
  onPressSuggestion,
  isLoading,
}) => {
  // Dữ liệu để render, dựa trên việc người dùng có chọn địa điểm cụ thể hay không
  const dataToRender = selectedLocation === 'all' || !selectedLocation ? tours : locationTours;

  // Component hiển thị khi danh sách trống
  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
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

  return (
    <View style={styles.sectionWrapper}>
        {/* Tiêu đề cho khu vực này */}
        <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
      
        {/* Danh sách các tour đề xuất */}
        <FlatList
            data={dataToRender}
            renderItem={({ item }) => (
              <SuggestionCard item={item} onPress={() => onPressSuggestion(String(item._id))} />
            )}
            keyExtractor={(item) => String(item._id)}
            numColumns={2}
            scrollEnabled={false} // Thường thì list này nằm trong một ScrollView lớn hơn
            contentContainerStyle={styles.suggestionListContent}
            ListEmptyComponent={renderEmptyList}
        />
    </View>
  );
};


const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 0.8,
    borderColor: COLORS.lightBorder || "#EAEAEA",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  suggestionListContent: {
    paddingTop: 15,
    paddingBottom: 5, 
    paddingHorizontal: 5,
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 200,
    paddingHorizontal: 15,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SuggestionsSection;