import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
  onSelectionUpdate, // ✅ THÊM DÒNG NÀY
  title = 'Các dịch vụ cần thiết',



}) => {
  const defaultDate = dateFilters.find(df => df.isDefault)?.id || dateFilters[0]?.id;
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedPromotion, setSelectedPromotion] = useState(promotions[0]?.id || null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleDatePress = id => {

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
      const newSelected = { ...prev };

      // Nếu option này đang được chọn → bỏ chọn
      if (newSelected[pkgId] === opt.id) {
        delete newSelected[pkgId];
      } else {
        newSelected[pkgId] = opt.id;
      }

      // Tính lại tổng giá
      const total = servicePackages.reduce((sum, pkg) => {
        const selectedOptId = newSelected[pkg.id];
        const selectedOpt = pkg.options.find(o => o.id === selectedOptId);
        return sum + (selectedOpt?.price || 0);
      }, 0);

      // Gọi callback truyền ra ngoài
      if (onOptionSelect) onOptionSelect(pkgId, opt);
      if (onSelectionUpdate) onSelectionUpdate(newSelected, total);

      return newSelected;
    });
  };



  return (
    <ScrollView style={styles.container}>
      {/* Ưu đãi */}
      {promotions.length > 0 && (
        <View style={styles.promotionContainerRow}>
          <Text style={styles.promotionTitle}>Ưu đãi cho bạn</Text>
          <View style={styles.promotionChipsRow}>
            {promotions.map(promo => (
              <TouchableOpacity
                key={promo.id}
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
              {dateFilters.map(df => (
                <TouchableOpacity
                  key={df.id}
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
              const isSelected = selectedOptions[pkg.id] === opt.id;
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
  section: {
    top: 2,
    marginBottom: 2,
    paddingHorizontal: 16,
  },
  promotionContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingVertical: 0,
  },

  promotionContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
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
  chevronIcon: {
    marginLeft: 8,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },

  chip: {

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
  chipSquare: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,

  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,

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

  innerSection: {
    marginBottom: 2,
  },
  packageSection: {
    marginBottom: 0,
  },

  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },





});

export default ProductOptionSelector;
