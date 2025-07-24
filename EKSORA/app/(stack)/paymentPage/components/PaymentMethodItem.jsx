import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

const PaymentMethodItem = ({ item, isSelected, onSelect, styles }) => (
  <TouchableOpacity
    style={[styles.methodRow, isSelected && styles.methodRowSelected]}
    onPress={onSelect}
  >
    <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.primary} style={styles.methodIcon} />
    <View style={styles.methodInfo}>
      <Text style={styles.methodLabel}>{item.label}</Text>
      {item.note && <Text style={styles.methodNote}>{item.note}</Text>}
    </View>
    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
      {isSelected && <Ionicons name="checkmark-sharp" size={14} color={COLORS.white} />}
    </View>
  </TouchableOpacity>
);

export default React.memo(PaymentMethodItem);