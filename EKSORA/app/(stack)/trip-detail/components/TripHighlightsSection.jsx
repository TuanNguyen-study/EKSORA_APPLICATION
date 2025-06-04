
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8; 
const ITEM_SPACING = 15;

const HighlightCard = ({item}) => {
    return (
        <View style={styles.highlightCard}>
            <Image source={item.image} style={styles.highlightImage} />
            <View style={styles.highlightTextContainer}>
                <Text style={styles.highlightTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.highlightDescription} numberOfLines={3}>{item.description}</Text>
            </View>
        </View>
    )
}

const TripHighlightsSection = ({ title, highlights }) => {
  if (!highlights || highlights.length === 0) {
    return null; 
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <FlatList
        data={highlights}
        renderItem={({item}) => <HighlightCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
            paddingHorizontal: (width - ITEM_WIDTH) / 2 - ITEM_SPACING / 2, 
            paddingVertical: 10,
        }}
        getItemLayout={(data, index) => (
            { length: ITEM_WIDTH + ITEM_SPACING, offset: (ITEM_WIDTH + ITEM_SPACING) * index, index }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: COLORS.background, 
    marginHorizontal: -16, 
    paddingHorizontal: 0, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 16, 
  },
  highlightCard: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  highlightImage: {
    width: '100%',
    height: ITEM_WIDTH * 0.6, 
    backgroundColor: COLORS.border,
  },
  highlightTextContainer: {
    padding: 12,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  highlightDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default TripHighlightsSection;