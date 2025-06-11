import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Offer() {
  const offers = [
    {
      title: 'Mã giảm giá',
      discount: 'Giảm 10%',
      condition: 'Đơn từ 15.000.000 VNĐ',
      buttonText: 'Lưu mã',
      isSelected: true, // cái box được chọn (viền xanh)
    },
    {
      title: 'Mã giảm giá',
      discount: 'Giảm 10%',
      condition: 'Đơn từ 3.000.000 VNĐ',
      buttonText: 'Lưu mã',
      isSelected: false,
    },
    {
      title: 'Mã giảm giá',
      discount: 'VNĐ 799,086',
      condition: 'Đơn tối thiểu 3.000.000 VNĐ',
      buttonText: 'Sử dụng',
      isSelected: false,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#007ecc', '#007ecc']} style={styles.headerContainer}>
        <Text style={styles.header}>Mã ưu đãi</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {offers.map((offer, index) => (
          <View
            key={index}
            style={[
              styles.cardWrapper,
              offer.isSelected && styles.selectedCardWrapper,
            ]}
          >
            <LinearGradient colors={['#2f6c99', '#4f91b8']} style={styles.codeBox}>
              <View style={styles.boxHeader}>
                <Text style={styles.boxHeaderText}>{offer.title}</Text>
              </View>
              <View style={styles.boxBody}>
                <Text style={styles.discount}>{offer.discount}</Text>
                <Text style={styles.condition}>{offer.condition}</Text>
                <TouchableOpacity
                  style={[
                    styles.button,
                    offer.buttonText === 'Sử dụng' && styles.useButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      offer.buttonText === 'Sử dụng' && styles.useButtonText,
                    ]}
                  >
                    {offer.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#007ecc',
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
  },
  selectedCardWrapper: {
    borderColor: '#00aaff',
    borderWidth: 2,
    borderRadius: 16,
  },
  codeBox: {
  width: 110,          
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
    padding: 10,
    alignItems: 'center',
  },
   discount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  condition: {
    fontSize: 10,
    color: '#e0f0ff',
    marginBottom: 10,
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
  },
  
  useButton: {
    backgroundColor: '#026fc3',
  },
  useButtonText: {
    color: 'white',
  },
});
