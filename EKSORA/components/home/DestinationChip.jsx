import React from 'react';
import {  Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

const DestinationChip = ({ destination, onPress }) => (
  <TouchableOpacity style={styles.chip} onPress={() => onPress(destination)}>
    <Image source={{ uri: destination.image }} style={styles.chipImage} />
    <Text style={styles.chipText}>{destination.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginRight: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border, 
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary, 
  },
});

export default DestinationChip;