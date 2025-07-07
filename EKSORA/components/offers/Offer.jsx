import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVoucher } from '../../store/VoucherContext';
import CouponModal from '../../app/(stack)/Voucher/CouponModal';

const { width: screenWidth } = Dimensions.get('window');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Không xác định';
  return `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')
  }/${date.getFullYear()}`;
};

export default function Offer() {
  const { coupons, saveVoucher } = useVoucher();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleSave = async (id, isSaved) => {
    if (isSaved) {
      Alert.alert('Thông báo', 'Bạn đã lưu voucher này rồi');
      return;
    }
    await saveVoucher(id);
    Alert.alert('Thành công', 'Đã lưu voucher');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#007ecc', '#007ecc']} style={styles.headerContainer}>
        <Text style={styles.header}>Mã ưu đãi</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {coupons.slice(0, 10).map((offer) => (
          <View key={offer.id} style={styles.cardWrapper}>
            <LinearGradient colors={['#00639B', '#0087CA']} style={styles.codeBox}>
              <View style={styles.boxHeader}>
                <Text style={styles.boxHeaderText}>{offer.title}</Text>
              </View>
              <View style={styles.boxBody}>
                <Text style={styles.discount}>{offer.discount}</Text>
                <Text style={styles.condition}>{offer.condition}</Text>
                {offer.expiry && (
                  <Text style={styles.condition}>HSD: {formatDate(offer.expiry)}</Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    offer.isSaved && { backgroundColor: '#ccc', borderWidth: 0 },
                  ]}
                  disabled={offer.isSaved}
                  onPress={() => handleSave(offer.id, offer.isSaved)}
                >
                  <Text style={styles.buttonText}>{offer.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      <CouponModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  seeAll: {
    color: 'white',
    fontSize: 14,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 12,
  },
  cardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  codeBox: {
    width: screenWidth * 0.3,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  boxHeader: {
    backgroundColor: '#0090d0',
    paddingVertical: 6,
    alignItems: 'center',
  },
  boxHeaderText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  boxBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  condition: {
    fontSize: 12,
    color: '#e0f0ff',
    textAlign: 'center',
  },
  buttonText: {
    color: '#005bac',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    width: '100%',
    borderWidth: 0.5,
  },
});
