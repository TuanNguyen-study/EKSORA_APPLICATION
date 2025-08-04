import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import styles from './styles';

const QuantitySelector = ({ label, priceText, quantity, onDecrement, onIncrement }) => {
  return (
    <View style={styles.quantityRow}>
      <Text style={styles.quantityLabel}>{label}</Text>
      <Text style={styles.priceText}>{priceText}</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity onPress={onDecrement} style={styles.quantityButton}>
          <Ionicons name="remove-circle-outline" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{quantity}</Text>
        <TouchableOpacity onPress={onIncrement} style={styles.quantityButton}>
          <Ionicons name="add-circle-outline" size={28} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuantitySelector;