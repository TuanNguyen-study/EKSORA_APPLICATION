import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllToursByLocation } from '../../../../API/services/serverCategories';

const ModalAddTour = ({ visible, onClose, cateID, onAddTour, existingTourIds = [] }) => {
  const [tourList, setTourList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await getAllToursByLocation(cateID);

      // Lọc những tour chưa tồn tại trong existingTourIds (id)
      const filtered = res.filter(
        (tour) => !existingTourIds.includes(tour._id)
      );

      setTourList(filtered);
    } catch (err) {
      console.error('Lỗi khi gọi getToursByLocation:', err);
      Alert.alert('Lỗi', 'Không thể tải danh sách tour.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && cateID) {
      fetchTours();
    }
  }, [visible, cateID]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.category}>{item.cateID.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          onAddTour({ ...item, isAdded: true });
          Alert.alert('Thành công', 'Thêm tour vào lịch trình thành công!');
        }}
        style={styles.addButton}
      >
        <Ionicons name="add-circle" size={32} color="#1e90ff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Chọn tour thêm vào lịch trình</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="gray" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1e90ff" />
              <Text style={styles.loadingText}>Đang tải danh sách tour...</Text>
            </View>
          ) : (
            <FlatList
              data={tourList}
              keyExtractor={(item, index) =>
                item?.idProduct ? item.idProduct.toString() : index.toString()
              }
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddTour;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#666',
  },
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
