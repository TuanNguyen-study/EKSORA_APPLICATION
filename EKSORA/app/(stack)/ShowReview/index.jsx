import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import ReviewItem from './components/ShowReviewItem';
import { useReviewContext } from '../../../store/ReviewContext';
import { useRouter } from 'expo-router';


const ShowReview = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const { reviewData } = useReviewContext();
  const reviews = reviewData?.reviews ?? [];
  const averageRating = reviewData?.rating ?? 0;
  const totalReviewsCount = reviewData?.count ?? 0;
  const router = useRouter();


  const renderHeader = () => (
    <>
      <View style={styles.summaryContainer}>
        <Ionicons name="heart" size={40} color="#FF6B6B" style={styles.emoji} />
        <View style={styles.ratingSummary}>
          <Text style={styles.mainRating}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.ratingTotal}>/5</Text>
        </View>
        <View>
          <Text style={styles.satisfactionText}>Hài lòng</Text>
          <Text style={styles.reviewCount}>{totalReviewsCount} Đánh giá</Text>
        </View>
      </View>

      <Text style={styles.customerReviewsTitle}>Đánh giá của khách</Text>

      <View style={styles.sortFilterContainer}>
        <View style={styles.sortSection}>
          <Text style={styles.filterLabel}>Sắp xếp theo:</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Đánh giá phù hợp nhất</Text>
            <AntDesign name="down" size={14} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Lọc theo:</Text>
          <View style={styles.filterButtons}>
            {['Tất cả', 'Có hình ảnh', 'Chỉ tiếng Việt'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter && styles.activeFilterButtonText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Thêm paddingTop nếu Android */}
        <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Đánh giá</Text>
            <View style={{ width: 28 }} />
          </View>
        </View>

        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emoji: {
    fontSize: 40,
    marginRight: 10,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 10,
  },
  mainRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A00E0',
  },
  ratingTotal: {
    fontSize: 18,
    color: '#888',
    marginLeft: 2,
  },
  satisfactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  customerReviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sortFilterContainer: {
    marginBottom: 10,
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sortButtonText: {
    color: '#FF6B6B',
    marginRight: 5,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  filterButtonText: {
    color: '#555',
  },
  activeFilterButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});

export default ShowReview;
