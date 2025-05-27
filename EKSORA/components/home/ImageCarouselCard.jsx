import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_PREVIEW_WIDTH = width * 0.10; 
const CARD_WIDTH = width - (CARD_PREVIEW_WIDTH * 2) - 20; 
const ITEM_WIDTH = width * 0.60; 
const ITEM_SPACING = 15; 

const ImageCarouselCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={item.image} style={styles.image} resizeMode="cover" />
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: 150, 
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
    marginHorizontal: ITEM_SPACING / 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageCarouselCard;