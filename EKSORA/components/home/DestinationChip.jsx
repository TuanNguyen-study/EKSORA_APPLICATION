import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

// 1. Nhận thêm prop `isSelected`
const DestinationChip = ({ destination, onPress, isSelected }) => {
  const hasImage = destination && destination.image;

  return (
    // 2. Áp dụng style có điều kiện
    <TouchableOpacity 
      style={[styles.chip, isSelected && styles.selectedChip]} 
      onPress={() => onPress(destination)}
    >
      {hasImage && (
        <Image
          source={{ uri: destination.image }}
          style={styles.chipImage}
          resizeMode="cover"
        />
      )}
      <Text style={[
        styles.chipText,
        isSelected && styles.selectedChipText,
        !hasImage && { marginLeft: 10 }
      ]}>
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
    paddingLeft: 2,
    paddingRight: 15,
    paddingVertical: 2,
    height: 52,
    borderWidth: 1.5, 
    borderColor: COLORS.border || '#EAEAEA',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedChip: {
    //borderColor: COLORS.primary, 
    backgroundColor: '#EBF4FF', 
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
    color: COLORS.textSecondary || '#555', 
  },
  selectedChipText: {
    color: COLORS.primary, 
    fontWeight: 'bold',
  }
});

export default DestinationChip;