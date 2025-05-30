// app/(stack)/trip-detail/components/ProductOptionSelector.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
// Bạn có thể cần một component DatePicker modal
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// Component Stepper nhỏ
const QuantityStepper = ({ label, count, onIncrement, onDecrement, min = 0, max = 10 }) => (
  <View style={styles.stepperRow}>
    <Text style={styles.stepperLabel}>{label}</Text>
    <View style={styles.stepperControls}>
      <TouchableOpacity onPress={onDecrement} disabled={count <= min} style={styles.stepperButton}>
        <Ionicons name="remove-circle-outline" size={28} color={count <= min ? COLORS.textLight : COLORS.primary} />
      </TouchableOpacity>
      <Text style={styles.stepperCount}>{count}</Text>
      <TouchableOpacity onPress={onIncrement} disabled={count >= max} style={styles.stepperButton}>
        <Ionicons name="add-circle-outline" size={28} color={count >= max ? COLORS.textLight : COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
);


const ProductOptionSelector = ({ options, currentPrice, onSelectionChange }) => {
  const [selectedDate, setSelectedDate] = useState(options?.departureDates?.[0]?.value || null);
  const [passengerCounts, setPassengerCounts] = useState(
    options?.passengerTypes?.reduce((acc, type) => {
      acc[type.id] = type.count || 0;
      return acc;
    }, {}) || {}
  );
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);

  // Tính toán tổng giá dựa trên lựa chọn (ví dụ đơn giản)
  const totalPrice = useMemo(() => {
    if (!options?.passengerTypes) return currentPrice;
    let total = 0;
    options.passengerTypes.forEach(type => {
      total += (passengerCounts[type.id] || 0) * (type.pricePerUnit || 0);
    });
    return total > 0 ? total : currentPrice; // Nếu không chọn khách nào, dùng giá gốc
  }, [passengerCounts, options?.passengerTypes, currentPrice]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({ date: selectedDate, passengers: passengerCounts }, totalPrice);
    }
  }, [selectedDate, passengerCounts, totalPrice, onSelectionChange]);

  const handlePassengerChange = (typeId, increment) => {
    setPassengerCounts(prev => {
      const currentCount = prev[typeId] || 0;
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1); // Đảm bảo không âm
      // Giới hạn số lượng (ví dụ)
      if (newCount > 10 && increment) return prev; // Max 10 per type
      return { ...prev, [typeId]: newCount };
    });
  };

  // const showDatePicker = () => setDatePickerVisibility(true);
  // const hideDatePicker = () => setDatePickerVisibility(false);
  // const handleConfirmDate = (date) => {
  //   setSelectedDate(date.toISOString().split('T')[0]); // Format YYYY-MM-DD
  //   hideDatePicker();
  // };

  const selectedDateLabel = options?.departureDates?.find(d => d.value === selectedDate)?.label || "Chọn ngày";

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Chọn ngày & số lượng</Text>

      {/* Chọn ngày (Ví dụ đơn giản, bạn có thể dùng DatePicker) */}
      <TouchableOpacity style={styles.optionButton} /* onPress={showDatePicker} */>
        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>{selectedDateLabel}</Text>
        <Ionicons name="chevron-down-outline" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()} // Ví dụ: không cho chọn ngày quá khứ
      /> */}

      {/* Chọn số lượng hành khách */}
      {options?.passengerTypes?.map(type => (
        <QuantityStepper
          key={type.id}
          label={`${type.label} (${(type.pricePerUnit || 0).toLocaleString('vi-VN')}đ)`}
          count={passengerCounts[type.id] || 0}
          onIncrement={() => handlePassengerChange(type.id, true)}
          onDecrement={() => handlePassengerChange(type.id, false)}
        />
      ))}

      {/* Quick Filters (Chips) */}
      {options?.quickFilters && options.quickFilters.length > 0 && (
        <View style={styles.chipContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 5 }}>
            {options.quickFilters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.chip, selectedQuickFilter === filter && styles.chipSelected]}
                onPress={() => setSelectedQuickFilter(filter)}
              >
                <Text style={[styles.chipText, selectedQuickFilter === filter && styles.chipTextSelected]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.priceSummary}>
        <Text style={styles.priceSummaryLabel}>Tổng tạm tính:</Text>
        <Text style={styles.priceSummaryValue}>{totalPrice.toLocaleString('vi-VN')} đ</Text>
      </View>

      <TouchableOpacity style={styles.viewAvailabilityButton}>
        <Text style={styles.viewAvailabilityButtonText}>Kiểm tra phòng trống</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.primaryUltraLight,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepperLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    flex: 1,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    padding: 5,
  },
  stepperCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 30,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  chipContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  chip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceSummaryLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  priceSummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  viewAvailabilityButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  viewAvailabilityButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductOptionSelector;