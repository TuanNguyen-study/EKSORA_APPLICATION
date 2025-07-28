import { Modal, View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getToursByLocation } from '../../../../API/services/serverCategories';

export default function ScheduleTourModal({ visible, onClose, cateID, onAddTour }) {
  const [tourList, setTourList] = useState([]);

  useEffect(() => {
    if (visible && cateID) {
      fetchTours();
    }
  }, [visible, cateID]);

  const fetchTours = async () => {
    try {
      const res = await getToursByLocation(cateID);
      setTourList(res);
    } catch (err) {
      console.error('Lỗi tải tour:', err);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: Array.isArray(item.image) ? item.image[0] : item.image }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.category}>{item.cateID?.name}</Text>

        </View>
        <TouchableOpacity onPress={() => onAddTour(item)} style={styles.iconWrapper}>
          <Ionicons name="add-circle" size={30} color="#1e90ff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Địa Điểm</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tourList}
          keyExtractor={(item) => item.idProduct?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  category: {
  fontSize: 13,
  color: '#888',
  marginTop: 4,
},
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  iconWrapper: {
    padding: 4,
  },
});
