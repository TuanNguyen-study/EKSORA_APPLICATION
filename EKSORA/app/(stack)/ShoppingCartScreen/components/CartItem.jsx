import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return `${amount?.toLocaleString('vi-VN') || '0'} đ`;
};


const CartItem = ({ item, isSelected, onToggleSelect, onDelete, onEdit }) => {
  if (!item) {
    return null; 
  }

  return (
    <View style={styles.card}>
      {/* Checkbox */}
      <TouchableOpacity onPress={() => onToggleSelect(item.id)} style={styles.checkboxContainer}>
        <Ionicons
          name={isSelected ? 'checkbox' : 'square-outline'}
          size={24}
          color={isSelected ? '#00639B' : '#888'}
        />
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80' }}
        style={styles.image}
      />

      {/* Details - Phần này đã được cập nhật hoàn toàn */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name || 'Tên tour không xác định'}</Text>
        
        {/* Hiển thị ngày đi */}
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color="#555" />
          <Text style={styles.detailText}>Ngày đi: {item.travelDate}</Text>
        </View>

        {/* Hiển thị số lượng người */}
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={14} color="#555" />
          <Text style={styles.detailText}>{item.adults} Người lớn, {item.children} Trẻ em</Text>
        </View>

        {/* Hiển thị các tùy chọn dịch vụ đã chọn (nếu có) */}
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <View style={styles.optionsContainer}>
            {item.selectedOptions.map((opt, index) => (
              <Text key={index} style={styles.optionText} numberOfLines={1}>
                + {opt.optionName}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          <View style={styles.actionsContainer}>
              {/* Nút Xóa */}
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#D9534F" />
              </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkboxContainer: {
    paddingRight: 12,
    paddingTop: 4, 
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 6,
  },
  optionsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00639B',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 12,
  },
});

export default React.memo(CartItem);