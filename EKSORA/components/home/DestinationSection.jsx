// components/home/DestinationSection.js

import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import DestinationChip from "./DestinationChip";
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS } from "../../constants/colors"; 


const DestinationSection = ({ categories, selectedLocation, onPressDestination, onPressNearby }) => {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bạn muốn đi đâu?</Text>
        
        <TouchableOpacity style={styles.nearbyButton} onPress={onPressNearby}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.nearbyButtonText}>Gần đây</Text>
        </TouchableOpacity>

      </View>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <DestinationChip
            destination={item}
            onPress={() => onPressDestination(item)}
            isSelected={selectedLocation === item._id}
          />
        )}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContentPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  // Bỏ style cho image cũ
  // decorativeImage: { ... },

  // ---- STYLE MỚI CHO NÚT BẤM ----
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray, // Màu nền nhẹ cho nút
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  nearbyButtonText: {
    marginLeft: 5,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  // ---- KẾT THÚC STYLE MỚI ----

  horizontalListContentPadding: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

export default DestinationSection;