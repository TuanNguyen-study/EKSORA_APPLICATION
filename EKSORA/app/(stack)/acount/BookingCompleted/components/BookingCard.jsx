// File: screens/BookingCompleted/BookingSummaryCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../../../constants/colors';

const DetailRow = ({ iconName, label, value }) => (
  <View style={styles.detailRow}>
    <Ionicons name={iconName} size={18} color={COLORS.primary} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const BookingSummaryCard = ({ image, title, travelDate, quantityAdult, quantityChild, totalPrice }) => (
  <View style={styles.card}>
    <View style={styles.contentWrapper}>
      <Text style={styles.cardTitle}>{title}</Text>

      <DetailRow iconName="ticket-outline" label="Loại vé" value="Vé tiêu chuẩn" />
      <DetailRow iconName="calendar-outline" label="Ngày tham gia" value={travelDate} />
      <DetailRow iconName="person-outline" label="Người lớn" value={`x ${quantityAdult}`} />
      {Number(quantityChild) > 0 && (
        <DetailRow iconName="body-outline" label="Trẻ em" value={`x ${quantityChild}`} />
      )}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalPriceText}>
          {Number(totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // Card container
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentWrapper: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
  },

  // Detail Section
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
    flex: 1, // Để label chiếm không gian còn lại
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '600',
  },

  // Divider and Total
  divider: {
    height: 1,
    backgroundColor: '#F4F5F7',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default BookingSummaryCard;