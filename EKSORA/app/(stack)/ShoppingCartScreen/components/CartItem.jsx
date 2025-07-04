import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

const formatCurrency = (amount) => {
  return amount?.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }) || '0 đ';
};

const CartItem = ({ item, isSelected, onToggleSelect, onDelete, onEdit }) => {
  if (!item) {
    console.log('Item không tồn tại:', item);
    return null;
  }

  console.log('Dữ liệu item trong CartItem:', item);

  const discountAmount = item.originalPrice ? item.originalPrice - (item.price || 0) : 0;
  const discountPercent = item.discountPercent || 0;
  const ratingStars = item.rating?.stars || 0;

  return (
    <View style={styles.container}>
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxBase}
        onPress={() => onToggleSelect(item.id)}
      >
        {isSelected && (
          <View style={styles.checkboxChecked}>
            <AntDesign name="check" size={14} color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80' }}
        style={styles.itemImage}
      />

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{item.name || 'Tên tour không xác định'}</Text>
        {/* Hiển thị mô tả */}
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">
            {item.description || 'Không có mô tả'}
          </Text>
        )}
        {/* Hiển thị thời lượng và địa điểm */}
        {item.duration || item.location ? (
          <Text style={styles.itemSubInfo}>
            {item.duration ? `${item.duration} - ` : ''}{item.location || 'Địa điểm không xác định'}
          </Text>
        ) : null}
        {/* Hiển thị đánh giá */}
        {item.rating && (
          <Text style={styles.itemRating}>
            Đánh giá: {ratingStars} ★
          </Text>
        )}
        {/* Hiển thị tùy chọn dịch vụ */}
        {Object.keys(item.selectedOptions || {}).length > 0 && (
          <Text style={styles.itemDescription}>
            Tùy chọn: {Object.values(item.selectedOptions || {})
              .map((optId) => {
                const serviceOption = item.services?.flatMap(s => s.options).find(opt => opt._id === optId);
                return serviceOption ? serviceOption.name : 'Không rõ';
              })
              .join(', ')}
          </Text>
        )}
        <View style={styles.priceSection}>
          {discountPercent > 0 && (
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>Giảm {discountPercent}%</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            {discountAmount > 0 && (
              <Text style={styles.discountAmountText}>
                Giảm {formatCurrency(discountAmount)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Feather name="trash-2" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  checkboxBase: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#00639B', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00639B',
    borderRadius: 4.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  itemSubInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  itemRating: {
    fontSize: 12,
    color: '#00639B',
    marginBottom: 4,
  },
  priceSection: {
    marginTop: 8,
  },
  discountTag: {
    backgroundColor: '#FFEFE0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  discountText: {
    color: '#FF6F00',
    fontSize: 11,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  discountAmountText: {
    fontSize: 12,
    color: '#FF6F00',
    marginLeft: 8,
  },
  actionsContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },
});

export default React.memo(CartItem);