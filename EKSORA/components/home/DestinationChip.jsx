import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

const DestinationChip = ({ destination, onPress, isSelected }) => {
  const imageSource =
    destination.image
      ? typeof destination.image === 'string'
        ? { uri: destination.image }
        : destination.image
      : require('../../assets/images/icon.png');

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && styles.chipSelected, 
      ]}
      onPress={() => onPress(destination)}
    >
      <Image source={imageSource} style={styles.chipImage} />
      <Text
        style={[
          styles.chipText,
          isSelected && styles.chipTextSelected, 
        ]}
      >
        {destination.name}
      </Text>
    </TouchableOpacity>
  );
};

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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF1FF',
  },
  chipImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14, 
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  selectedChipText: {
    color: COLORS.primary, 
    fontWeight: 'bold',
  }
});

export default DestinationChip;
