
import React, { useState, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

// Giữ lại MOCK_DATA
const MOCK_SERVICE_PACKAGES = [
  {
    id: 'pkg_adult',
    name: 'Người lớn',
    availabilityInfo: 'Đặt từ 11/5', 
    currentPrice: 750000,
    originalPrice: 800000,
    currency: 'đ',
  },
  {
    id: 'pkg_child',
    name: 'Trẻ em (Cao 90cm-120cm)',
    availabilityInfo: 'Đặt từ 11/5',
    currentPrice: 70000,
    originalPrice: 100000,
    currency: 'đ',
  },
  {
    id: 'pkg_senior',
    name: 'Người cao tuổi (Trên 60t)',
    availabilityInfo: 'Đặt từ 11/5',
    currentPrice: 600000,
    originalPrice: 650000,
    currency: 'đ',
  }
];

const MOCK_DATE_FILTERS = [
    { id: 'today', label: 'Hôm nay' }, 
    { id: 'tomorrow', label: 'Ngày mai', isDefault: true },
    { id: 'date_11_5', label: '11/5' },
    { id: 'date_12_5', label: '12/5' },
    { id: 'all_dates', label: 'Tất cả ngày', icon: 'calendar-outline' },
];


const ProductOptionSelector = ({
  options, 
  servicePackages = MOCK_SERVICE_PACKAGES, 
  dateFilters = MOCK_DATE_FILTERS,     
  onPackageSelect,
  onDateFilterChange, 
}) => {
  const defaultDateFilter = dateFilters.find(df => df.isDefault)?.id || (dateFilters.length > 0 ? dateFilters[0].id : null);
  const [selectedDateFilterId, setSelectedDateFilterId] = useState(defaultDateFilter);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const handleDateFilterPress = (filterId) => {
    setSelectedDateFilterId(filterId);
    if (onDateFilterChange) {
      onDateFilterChange(filterId);
    }
  };

  const handlePackageSelect = (packageItem) => {
    setSelectedPackageId(packageItem.id); 
    if (onPackageSelect) {
      onPackageSelect(packageItem); 
    }
    Alert.alert("Đã chọn gói", packageItem.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIndicator} />
        <Text style={styles.sectionTitle}>Các gói dịch vụ</Text>
      </View>

      {/* Date Filters */}
      <View style={styles.dateFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateFiltersScroll}>
          {dateFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.dateChip,
                selectedDateFilterId === filter.id && styles.dateChipSelected
              ]}
              onPress={() => handleDateFilterPress(filter.id)}
            >
              {filter.icon && (
                <Ionicons
                  name={filter.icon}
                  size={16}
                  color={selectedDateFilterId === filter.id ? COLORS.primary : COLORS.textSecondary}
                  style={styles.dateChipIcon}
                />
              )}
              <Text style={[
                styles.dateChipText,
                selectedDateFilterId === filter.id && styles.dateChipTextSelected
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Service Package Cards */}
      <View style={styles.packagesContainer}>
        {servicePackages.map((pkg) => (
          <View key={pkg.id} style={styles.packageCard}>
            <View style={styles.packageInfo}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              {pkg.availabilityInfo && <Text style={styles.packageAvailability}>{pkg.availabilityInfo}</Text>}
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>
                  {pkg.currency}{pkg.currentPrice.toLocaleString('vi-VN')}
                </Text>
                {pkg.originalPrice && pkg.originalPrice > pkg.currentPrice && (
                  <Text style={styles.originalPrice}>
                    {pkg.currency}{pkg.originalPrice.toLocaleString('vi-VN')}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.selectButton, selectedPackageId === pkg.id && styles.selectButtonSelected]}
              onPress={() => handlePackageSelect(pkg)}
            >
              <Text style={[styles.selectButtonText, selectedPackageId === pkg.id && styles.selectButtonTextSelected]}>
                {selectedPackageId === pkg.id ? 'Đã chọn' : 'Chọn'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //paddingVertical: 16,
    backgroundColor: COLORS.white, 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIndicator: {
    width: 6,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateFiltersContainer: {
    marginBottom: 20,
  },
  dateFiltersScroll: {
    paddingHorizontal: 0, 
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white, 
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border, 
  },
  dateChipSelected: {
    backgroundColor: COLORS.primaryLight, 
    borderColor: COLORS.primary, 
  },
  dateChipIcon: {
    marginRight: 6,
  },
  dateChipText: {
    fontSize: 14,
    color: COLORS.textSecondary, 
    fontWeight: '500',
  },
  dateChipTextSelected: {
    color: COLORS.primary, 
    fontWeight: 'bold',
  },
  packagesContainer: {

  },
  packageCard: {
    backgroundColor: COLORS.white, 
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1, 
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  packageInfo: {
    flex: 1, 
    marginRight: 10,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  packageAvailability: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text, 
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 1, 
  },
  selectButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectButtonSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectButtonTextSelected: {
    color: COLORS.primary,
  }
});

export default ProductOptionSelector;