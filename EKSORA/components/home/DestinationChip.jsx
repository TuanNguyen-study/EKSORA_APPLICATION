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
        // 3. Thay đổi màu chữ khi được chọn
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
    // Màu border mặc định
    borderWidth: 1.5, // Tăng độ dày một chút cho rõ
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
  // 4. Style mới cho chip KHI được chọn
  selectedChip: {
    borderColor: COLORS.primary, // Đổi màu border sang màu xanh primary
    backgroundColor: '#EBF4FF', // Thêm màu nền xanh nhạt cho nổi bật (tùy chọn)
  },
  chipImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14, // Tăng size chữ 1 chút
    fontWeight: '500',
    color: COLORS.textSecondary || '#555', // Màu chữ mặc định
  },
  // 5. Style mới cho chữ KHI được chọn
  selectedChipText: {
    color: COLORS.primary, // Đổi màu chữ sang màu xanh primary
    fontWeight: 'bold',
  }
});

export default DestinationChip;