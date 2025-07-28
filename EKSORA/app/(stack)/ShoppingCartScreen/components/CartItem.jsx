
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../../store/CartContext'; 

const formatCurrency = (amount) => {
  return `${amount?.toLocaleString('vi-VN') || '0'} đ`;
};

const QuantitySelector = ({ label, quantity, onUpdate }) => {
  return (
    <View style={styles.quantitySelector}>
      <Text style={styles.quantityLabel}>{label}:</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity onPress={() => onUpdate(-1)} style={styles.quantityButton}>
          <Ionicons name="remove-circle-outline" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{quantity}</Text>
        <TouchableOpacity onPress={() => onUpdate(1)} style={styles.quantityButton}>
          <Ionicons name="add-circle-outline" size={24} color="#00639B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartItem = ({ item, isSelected, onToggleSelect, onDelete }) => {
  const { updateCartItem } = useCart();

  if (!item) {
    return null;
  }

  const handleUpdateQuantity = (type, amount) => {
    let { adults, children, adultPrice, childPrice, selectedOptions } = item;

    let newAdults = adults;
    let newChildren = children;

    if (type === 'adults') {
      newAdults += amount;
      if (newAdults < 1) newAdults = 1;
    } else {
      newChildren += amount;
      if (newChildren < 0) newChildren = 0;
    }

    const optionsPrice = (selectedOptions || []).reduce((sum, opt) => sum + (opt.price || 0), 0);
    const newTotalPrice = (adultPrice * newAdults) + (childPrice * newChildren) + optionsPrice;

    const updatedData = {
      adults: newAdults,
      children: newChildren,
      price: newTotalPrice,
    };

    updateCartItem(item.id, updatedData);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onToggleSelect(item.id)} style={styles.checkboxContainer}>
        <Ionicons name={isSelected ? 'checkbox' : 'square-outline'} size={24} color={isSelected ? '#00639B' : '#888'} />
      </TouchableOpacity>

      <Image source={{ uri: item.image || 'https://via.placeholder.com/80' }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name || 'Tên tour không xác định'}</Text>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color="#555" />
          <Text style={styles.detailText}>Ngày đi: {item.travelDate}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <QuantitySelector label="Người lớn" quantity={item.adults} onUpdate={(amount) => handleUpdateQuantity('adults', amount)} />
          <QuantitySelector label="Trẻ em" quantity={item.children} onUpdate={(amount) => handleUpdateQuantity('children', amount)} />
        </View>
        
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
        marginBottom: 6,
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 13,
        color: '#555',
        marginLeft: 6,
    },
    quantityContainer: {
        paddingTop: 8,
    },
    quantitySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    quantityLabel: {
        fontSize: 14,
        color: '#333',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 4,
    },
    quantityValue: {
        fontSize: 15,
        fontWeight: 'bold',
        minWidth: 30,
        textAlign: 'center',
        marginHorizontal: 8,
        color: '#333',
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
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10,
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