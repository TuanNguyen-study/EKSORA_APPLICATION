import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../../constants/colors';
import ReviewItem from './ReviewItem';

const { width: screenWidth } = Dimensions.get('window');

// Component lấy từ ReviewItem hoặc ProductBasicInfo
const StarRatingDisplay = ({ rating, size = 20, color = COLORS.warning }) => { 
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Ionicons key={i} name="star" size={size} color={color} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<Ionicons key={i} name="star-half-sharp" size={size} color={color} />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={size} color={color} />);
      }
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

const CustomerReviewSection = ({ reviews, averageRating, totalReviewsCount, onViewAllReviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.container}>
         <View style={styles.sectionHeader}>
            <View style={styles.headerIndicator} />
            <Text style={styles.sectionTitle}>Đánh giá</Text>
        </View>
        <Text style={styles.noReviewsText}>Chưa có đánh giá nào cho sản phẩm này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIndicator} />
        <Text style={styles.sectionTitle}>Đánh giá</Text>
      </View>

      {/* Thông tin Đánh giá Tổng quan */}
      <View style={styles.overallRatingContainer}>
        <Text style={styles.averageRatingText}>
          {averageRating?.toFixed(1)}
          <Text style={styles.ratingOutOfFive}>/5</Text>
        </Text>
        <View style={styles.starsAndTotalCount}>
            <StarRatingDisplay rating={averageRating} />
            <Text style={styles.totalReviewsText}>{totalReviewsCount} Đánh giá</Text>
        </View>
      </View>

      {/* Carousel Đánh giá Nổi bật */}
      <FlatList
        data={reviews} 
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewsCarouselContent}
      />

      {/* Nút Đọc tất cả bài đánh giá */}
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllReviews}>
        <Text style={styles.viewAllButtonText}>Đọc tất cả bài đánh giá</Text>
      </TouchableOpacity>      
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIndicator: {
    width: 6,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  overallRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRatingText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  ratingOutOfFive: {
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  starsAndTotalCount: {
    justifyContent: 'center',
  },
  totalReviewsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  reviewsCarouselContent: {
    paddingLeft: 0, 
    paddingRight: screenWidth - (screenWidth * 0.8) - 12, 
    paddingVertical: 8, 
  },
  viewAllButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1.5, 
    borderColor: COLORS.textSecondary, 
  },
  viewAllButtonText: {
    color: COLORS.text, 
    fontSize: 15,
    fontWeight: '500',
  },
  noReviewsText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default CustomerReviewSection;