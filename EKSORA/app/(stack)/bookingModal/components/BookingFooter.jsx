import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import styles from './styles';

const BookingFooter = ({ totalPrice, onAddToCart, onBookNow, isLoading }) => {
  return (
    <View style={styles.footer}>
      <View style={styles.footerTopRow}>
        <Text style={styles.totalPriceLabel}>Tổng cộng:</Text>
        <Text style={styles.totalPrice}>{totalPrice}</Text>
      </View>
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity 
          style={[styles.addToCartButton, isLoading && { opacity: 0.5 }]} 
          onPress={onAddToCart}
          disabled={isLoading}
        >
          <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.bookNowButton, isLoading && { opacity: 0.8 }]} 
          onPress={onBookNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.bookNowButtonText}>Đặt ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingFooter;