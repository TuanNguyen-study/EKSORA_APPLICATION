import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductOptionSelector = ({
  servicePackages = [],
  dateFilters = [],
  initialTotalPrice = 0,
  onDateFilterChange,
  onOptionSelect,
  onSelectionUpdate,
}) => {
  const defaultDate = dateFilters.find(df => df.isDefault)?.id || dateFilters[0]?.id;
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedOptions, setSelectedOptions] = useState({});

  const calculateTotalPrice = () => {
    let total = initialTotalPrice;
    Object.values(selectedOptions).forEach(opt => {
      total += opt.price || 0;
    });
    return total;
  };

  useEffect(() => {
    const total = calculateTotalPrice();
    onSelectionUpdate?.(selectedOptions, total);
  }, [selectedOptions]);

  const handleDatePress = (id) => {
    setSelectedDate(id);
    onDateFilterChange?.(id);
  };

  const handleOptionPress = (pkgId, opt) => {
  setSelectedOptions(prev => {
    const isCurrentlySelected = prev[pkgId]?.id === opt.id;
    const updated = { ...prev };

    if (isCurrentlySelected) {
      delete updated[pkgId]; // Bỏ chọn nếu đã chọn rồi
    } else {
      updated[pkgId] = opt; // Chọn option mới
    }

    return updated;
  });

  onOptionSelect?.(pkgId, opt);
};
  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateFilters}>
        {dateFilters.map(df => (
          <TouchableOpacity
            key={df.id}
            style={[styles.dateChip, selectedDate === df.id && styles.dateChipActive]}
            onPress={() => handleDatePress(df.id)}
          >
            {df.icon && (
              <Ionicons
                name={df.icon}
                size={16}
                color={selectedDate === df.id ? COLORS.primary : COLORS.textSecondary}
                style={styles.dateIcon}
              />
            )}
            <Text style={[styles.dateText, selectedDate === df.id && styles.dateTextActive]}>
              {df.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {servicePackages.map(pkg => (
        <View key={pkg.id} style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{pkg.title}</Text>
          {pkg.options.map(opt => {
            const isSelected = selectedOptions[pkg.id]?.id === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionCard, isSelected && styles.optionCardActive]}
                onPress={() => handleOptionPress(pkg.id, opt)}
              >
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, isSelected && styles.optionNameActive]}>
                    {opt.name}
                  </Text>
                  {opt.description && <Text style={styles.optionDesc}>{opt.description}</Text>}
                </View>
                <View style={styles.optionRight}>
                  <Text style={[styles.optionPrice, isSelected && styles.optionPriceActive]}>
                    {opt.price.toLocaleString('vi-VN')} đ
                  </Text>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? COLORS.primary : COLORS.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  dateFilters: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  dateChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  dateIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dateTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  groupContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  optionCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  optionNameActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  optionRight: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  optionPriceActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default ProductOptionSelector;
