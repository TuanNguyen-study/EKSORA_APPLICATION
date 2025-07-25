// components/home/DestinationSection.js

import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import DestinationChip from "./DestinationChip";

const DestinationSection = ({ categories, selectedLocation, onPressDestination }) => {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bạn muốn đi đâu chơi?</Text>
        <Image
          source={require('../../assets/images/66acd894de10f.png')}
          style={styles.decorativeImage}
        />
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
  decorativeImage: {
    width: 80,
    height: 50,
    resizeMode: 'cover',
  },
  horizontalListContentPadding: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

export default DestinationSection;