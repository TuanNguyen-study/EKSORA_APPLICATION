// app/(stack)/trip-detail/components/CustomerReviewSection.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ReviewItem from './ReviewItem'; // Import component con

// Component StarRating (có thể import từ ProductBasicInfo hoặc tạo file riêng)
const StarRatingDisplay = ({ rating, size = 18, color = COLORS.warning }) => {
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


const CustomerReviewSection = ({ reviews, averageRating, totalReviewsCount }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Đánh giá từ khách hàng</Text>
        <Text style={styles.noReviewsText}>Chưa có đánh giá nào cho sản phẩm này.</Text>
      </View>
    );
  }

  const displayedReviews = reviews.slice(0, 2); // Hiển thị 2 review đầu tiên

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Đánh giá từ khách hàng</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.averageRatingText}>{averageRating?.toFixed(1)}</Text>
        <View style={styles.summaryStarsAndCount}>
            <StarRatingDisplay rating={averageRating} size={20} />
            <Text style={styles.totalReviewsText}>{totalReviewsCount} đánh giá</Text>
        </View>
      </View>

      {/* Chỉ render FlatList nếu muốn cuộn nhiều review, ở đây chỉ hiển thị vài cái */}
      {displayedReviews.map(review => (
          <ReviewItem key={review.id} review={review} />
      ))}


      {reviews.length > displayedReviews.length && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllButtonText}>Xem tất cả {totalReviewsCount} đánh giá</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      )}
       <TouchableOpacity style={styles.writeReviewButton}>
          <Ionicons name="pencil-outline" size={18} color={COLORS.primary} style={{marginRight: 5}} />
          <Text style={styles.writeReviewButtonText}>Viết đánh giá của bạn</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: COLORS.primaryUltraLight,
    padding: 15,
    borderRadius: 8,
  },
  averageRatingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 10,
  },
  summaryStarsAndCount: {
      // không cần style nhiều ở đây
  },
  totalReviewsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  noReviewsText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  viewAllButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
    marginRight: 5,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
    // borderWidth: 1,
    // borderColor: COLORS.primary,
    // borderRadius: 8,
  },
  writeReviewButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
  }
});

export default CustomerReviewSection;