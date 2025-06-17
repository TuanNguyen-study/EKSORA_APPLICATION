import { Ionicons } from '@expo/vector-icons';

import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS } from '../../../../constants/colors';

const ProductOptionSelector = ({
  servicePackages = [],
  dateFilters = [],
  promotions = [],
  onDateFilterChange,
  onPromotionChange,
  onOptionSelect,
  onSelectionUpdate = () => {},
  title = 'Các dịch vụ cần thiết', // mặc định
}) => {
  const defaultDate = dateFilters.find(df => df.isDefault)?.id || dateFilters[0]?.id;
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedPromotion, setSelectedPromotion] = useState(promotions[0]?.id || null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const initialTotalPrice = 0;

  const calculateTotalPrice = () => {
    let total = 0; 
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

  const handlePromotionPress = id => {
    setSelectedPromotion(id);
    const selectedPromo = promotions.find(p => p.id === id);
    onPromotionChange?.(selectedPromo);
  };

  const handleOptionPress = (pkgId, opt) => {
    setSelectedOptions(prev => {
      const isCurrentlySelected = prev[pkgId]?.id === opt.id;
      const updated = { ...prev };
      if (isCurrentlySelected) {
        delete updated[pkgId];
      } else {
        updated[pkgId] = opt;
      }
      return updated;
    });
  };


return (
  <ScrollView style={styles.container}>
    {/* Ưu đãi */}
    {promotions.length > 0 && (
      <View style={styles.promotionContainerRow}>
        <Text style={styles.promotionTitle}>Ưu đãi cho bạn</Text>
        <View style={styles.promotionChipsRow}>
          {promotions.map((promo, index) => (
            <TouchableOpacity
              key={`${promo.id}-${index}`}
              style={[
                styles.chipSquareSmall,
                selectedPromotion === promo.id && styles.chipActive,
              ]}
              onPress={() => handlePromotionPress(promo.id)}
            >

              <Ionicons
                name="pricetags-outline"
                size={14}
                color={selectedPromotion === promo.id ? COLORS.primary : COLORS.textSecondary}
                style={styles.chipIcon}
              />

              <Text
                style={[
                  styles.chipTextSmall,
                  selectedPromotion === promo.id && styles.chipTextActive,
                ]}
              >
                {promo.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} style={styles.chevronIcon} />
      </View>
    )}

    {/* Các dịch vụ cần thiết */}
    <View style={styles.secttrion}>
     <Text style={styles.sectionTitle}>{title}</Text>
      {/* Chọn ngày */}
      {dateFilters.length > 0 && (
        <View style={styles.innerSection}>
          <Text style={styles.packageTitle}>Chọn ngày</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {dateFilters.map((df, index) => (
              <TouchableOpacity
                key={`${df.id}-${index}`}
                style={[
                  styles.chip,
                  selectedDate === df.id && styles.chipActive,
                ]}
                onPress={() => handleDatePress(df.id)}
              >
                {df.icon && (
                  <Ionicons
                    name={df.icon}
                    size={16}
                    color={selectedDate === df.id ? COLORS.primary : COLORS.textSecondary}
                    style={styles.chipIcon}
                  />
                )}
                <Text
                  style={[
                    styles.chipText,
                    selectedDate === df.id && styles.chipTextActive,
                  ]}
                >
                  {df.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Danh sách dịch vụ (thức ăn, phiên dịch, ...) */}

      {servicePackages.map(pkg => (
        <View key={pkg.id} style={styles.packageSection}>
          <Text style={styles.packageTitle}>{pkg.title}</Text>
          {pkg.options.map(opt => {
            const isSelected = selectedOptions[pkg.id]?.id === opt.id;
            return (
              <TouchableOpacity
                key={`${pkg.id}-${opt.id}`}
                style={[styles.optionCard, isSelected && styles.optionCardActive]}
                onPress={() => handleOptionPress(pkg.id, opt)}
              >
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, isSelected && styles.optionNameActive]}>
                    {opt.name}
                  </Text>

                  {!!opt.description && (
                    <Text style={styles.optionDesc}>{opt.description}</Text>
                  )}

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
    </View>
   

  </ScrollView>
);



};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  promotionContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingLeft: 0,
    paddingHorizontal: 16,
  },
  promotionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 20,
  },
  promotionChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexGrow: 1,
  },
  chipSquareSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  chipTextSmall: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
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
  horizontalScroll: {
    flexDirection: 'row',
  },
});

export default ProductOptionSelector;
