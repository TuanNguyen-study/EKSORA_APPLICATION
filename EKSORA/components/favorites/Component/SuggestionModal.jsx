import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';
import { getTours } from '../../../API/services/serverCategories';
import SuggestionCard from '../../home/SuggestionCard';

export default function SuggestionModal({ isVisible, onClose }) {
  const [suggestionTours, setSuggestionTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();

  // Hàm tải danh sách gợi ý
  const loadSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTours();
      const processedData = (data || []).map((tour) => ({
        ...tour,
        image: Array.isArray(tour.image) && tour.image.length > 0 ? tour.image[0] : "https://via.placeholder.com/300",
      }));
      setSuggestionTours(processedData);
    } catch (error) {
      console.error("Lỗi khi tải gợi ý tour:", error);
      setError("Không thể tải gợi ý tour. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadSuggestions();
    }
  }, [isVisible]);

  // Hàm này sẽ được gọi khi người dùng nhấn vào một thẻ gợi ý.
  const handleNavigateToDetail = (item) => {
    // Kiểm tra xem item và _id có tồn tại không
    if (!item || !item._id) {
        console.warn("Không có thông tin tour để điều hướng.");
        return;
    }

    // Bước 1: Đóng modal lại để giao diện mượt mà
    onClose(false);

    // Bước 2: Dùng router để đẩy sang màn hình chi tiết
    router.push(`/trip-detail/${item._id}`);
  };


  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#2a6ee4ff" style={{ marginVertical: 40 }} />;
    }
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadSuggestions} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (suggestionTours.length === 0) {
      return <Text style={styles.errorText}>Không tìm thấy gợi ý nào.</Text>;
    }
    return (
      <FlatList
        data={suggestionTours}
        renderItem={({ item }) => <SuggestionCard item={item} onPress={() => handleNavigateToDetail(item)} />}
        keyExtractor={(item) => item._id?.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.suggestionList}
      />
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => onClose(false)}
      onBackButtonPress={() => onClose(false)}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Gợi ý cho bạn</Text>
          <TouchableOpacity onPress={() => onClose(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        {renderContent()}
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { padding: 8 },
  closeButtonText: { fontSize: 24, fontWeight: 'bold', color: '#666' },
  suggestionList: { paddingBottom: 16 },
  errorContainer: { alignItems: 'center', padding: 32 },
  errorText: { fontSize: 16, color: '#d9534f', textAlign: 'center' },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#2a6ee4ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: { color: 'white' },
  columnWrapper: { justifyContent: 'space-between', marginHorizontal: 4 },
});