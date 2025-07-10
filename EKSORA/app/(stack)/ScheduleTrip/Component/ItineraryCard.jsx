import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;
const IMAGE_HEIGHT = 130;

export default function ItineraryCard({ image, day, date, places }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.dayTag}>
        <Text style={styles.dayText}>{day}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.places}>{places}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  dayTag: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
  },
  dayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textContainer: {
    padding: 10,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  places: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
