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

  const dataToRender = selectedLocation === 'all' || !selectedLocation ? tours : locationTours;

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )
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

  const renderNearbyContent = () => {
    return (
      <>
        <View style={styles.mapWrapper}>
          <CurrentLocationMap onLocationFound={onFindNearby} />
        </View>

        {isFindingNearby && (
          <View style={styles.nearbyStatusContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.nearbyStatusText}>Đang tìm các tour gần bạn...</Text>
          </View>
        )}

        {nearbyError && (
          <View style={styles.nearbyStatusContainer}>
            <Text style={styles.nearbyErrorText}>{nearbyError}</Text>
          </View>
        )}
        
        {!isFindingNearby && nearbyTours.length > 0 && (
          <FlatList
            data={nearbyTours}
            renderItem={({ item }) => (
              <SuggestionCard
                item={item}
                onPress={() => onPressSuggestion(String(item._id))}
              />
            )}
            keyExtractor={(item) => String(item._id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={styles.suggestionListContent}
          />
        )}
      </>
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

      {activeTab === "Đề xuất" && (
        <FlatList
          data={dataToRender}
          renderItem={({ item }) => (
            <SuggestionCard
              item={item}
              onPress={() => onPressSuggestion(String(item._id))}
            />
          )}
          keyExtractor={(item) => String(item._id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.suggestionListContent}
          ListEmptyComponent={renderEmptyList}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}

      {activeTab === "Gần đây" && renderNearbyContent()}
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
    paddingBottom: 10,
    minHeight: 300,
  },
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 15,
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
  suggestionListContent: {
    paddingHorizontal: 5, paddingTop: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyStateContainer: {
    justifyContent: "center", alignItems: "center", paddingVertical: 40, minHeight: 200, paddingHorizontal: 15,
  },
  emptyStateText: {
    fontSize: 16, color: COLORS.textSecondary, textAlign: 'center',
  },
  mapWrapper: {
    height: 250, borderRadius: 8, overflow: 'hidden', marginHorizontal: 10, marginTop: 15,
  },
  nearbyStatusContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 10,
  },
  nearbyStatusText: {
    fontSize: 16, color: COLORS.textSecondary,
  },
  nearbyErrorText: {
    fontSize: 16, color: 'red', textAlign: 'center', paddingHorizontal: 15,
  },
});

export default SuggestionTabs;