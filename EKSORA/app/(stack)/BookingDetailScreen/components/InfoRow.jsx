import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../../constants/colors';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} style={styles.infoIcon} />
    <View style={styles.textContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      
      <Text style={styles.infoValue} >{value || 'Chưa cập nhật'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  // Style quan trọng được thêm vào đây
  textContainer: {
    flex: 1, // Yêu cầu View này chiếm hết không gian còn lại
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});

export default React.memo(InfoRow);