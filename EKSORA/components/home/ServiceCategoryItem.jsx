import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Ví dụ icon mới
const newIcons = {
  'Vui chơi & Trải nghiệm': 'sparkles-outline',
  'Xe khách': 'bus-outline',
  'Tự thuê xe': 'key-outline',
  'Khách sạn': 'bed-outline',
  'Mục khác': 'apps-outline',
};

const ServiceCategoryItem = ({ label, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons name={newIcons[label] || 'help-circle-outline'} size={26} color={COLORS.primary} />
    </View>
    <Text style={styles.label} numberOfLines={2}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: (Dimensions.get('window').width - 30 - 40) / 5, 
  },
  iconContainer: {
    width: 48, 
    height: 48,
    borderRadius: 24, 
    backgroundColor: COLORS.primaryUltraLight, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11, 
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ServiceCategoryItem;