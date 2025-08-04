import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import styles from './styles';

const BookingFooter = ({ totalPrice, onAddToCart, onBookNow }) => {
  return (
    <View style={styles.footer}>
      <View style={styles.footerTopRow}>
        <Text style={styles.totalPriceLabel}>Tổng cộng:</Text>
        <Text style={styles.totalPrice}>{totalPrice}</Text>
      </View>
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
          <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookNowButton} onPress={onBookNow}>
          <Text style={styles.bookNowButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingFooter;