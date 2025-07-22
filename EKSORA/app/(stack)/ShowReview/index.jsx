import React, { useState, useMemo } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useReviewContext } from '../../../store/ReviewContext';
import { useRouter } from 'expo-router';
import ReviewItem from './components/ShowReviewItem';
import { COLORS } from '../../../constants/colors';
import ReviewFilterModal from './components/ReviewFilterModal'; 

// --- COMPONENT THỐNG KÊ PHÂN BỐ SAO  ---
const RatingDistribution = ({ reviews }) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (distribution[rating] !== undefined) {
      distribution[rating]++;
    }
  });
  const totalReviews = reviews.length;
  if (totalReviews === 0) return null;

  return (
    <View style={styles.distributionContainer}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return (
          <View key={star} style={styles.distRow}>
            <Text style={styles.distStarText}>{star}</Text>
            <Ionicons name="star" size={16} color={COLORS.warning} style={{ marginHorizontal: 4 }} />
            <View style={styles.distBarBackground}>
              <View style={[styles.distBarForeground, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.distCountText}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
};

// --- COMPONENT HEADER CỦA DANH SÁCH REVIEW  ---
const ReviewListHeader = ({ averageRating, totalReviewsCount, reviews, onSortPress, activeFilter }) => {
    const getSortButtonText = () => {
        if (activeFilter === null) {
            return 'Tất cả';
        }
        return `${activeFilter} sao`;
    }
    return (
        <>
            <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                    <Text style={styles.mainRating}>{averageRating.toFixed(1)}</Text>
                    <Text style={styles.ratingTotal}>/ 5</Text>
                </View>
                <View style={styles.summaryRight}>
                    <RatingDistribution reviews={reviews} />
                </View>
            </View>
            <Text style={styles.basedOnText}>{`Dựa trên ${totalReviewsCount} đánh giá`}</Text>
            <View style={styles.listHeaderContainer}>
                <Text style={styles.customerReviewsTitle}>Chi tiết đánh giá</Text>
                <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
                    <Text style={styles.sortButtonText}>{getSortButtonText()}</Text>
                    <AntDesign name="down" size={14} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </>
    );
};

// --- COMPONENT CHÍNH CỦA MÀN HÌNH ---
const ShowReview = () => {
  const { reviewData } = useReviewContext();
  const router = useRouter();

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const reviews = reviewData?.reviews ?? [];
  const averageRating = reviewData?.rating ?? 0;
  const totalReviewsCount = reviewData?.count ?? 0;

  const filteredReviews = useMemo(() => {
    if (activeFilter === null) {
      return reviews;
    }
    return reviews.filter(review => Math.round(review.rating) === activeFilter);
  }, [reviews, activeFilter]);

  const handleSelectFilter = (filterValue) => {
    setActiveFilter(filterValue);
    setFilterModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đánh giá của khách hàng</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ReviewItem review={item} />}
          ListHeaderComponent={
            <ReviewListHeader
              averageRating={averageRating}
              totalReviewsCount={totalReviewsCount}
              reviews={reviews}
              onSortPress={() => setFilterModalVisible(true)}
              activeFilter={activeFilter}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        />
      </View>

       <ReviewFilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onSelectFilter={handleSelectFilter}
        activeFilter={activeFilter}
        reviews={reviews} 
      />
    </SafeAreaView>
  );
};

// --- STYLESHEET CỦA TRANG  ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263238',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 20,
  },
  mainRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingTotal: {
    fontSize: 24,
    color: '#B0BEC5',
    fontWeight: '500',
    marginLeft: 2,
  },
  summaryRight: {
    flex: 1,
  },
  basedOnText: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  distributionContainer: {
    flex: 1,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  distStarText: {
    width: 15,
    fontSize: 14,
    color: '#546E7A',
  },
  distBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#ECEFF1',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  distBarForeground: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  distCountText: {
    width: 30,
    textAlign: 'right',
    fontSize: 14,
    color: '#546E7A',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  customerReviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#CFD8DC',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 6,
  },
});

export default ShowReview;