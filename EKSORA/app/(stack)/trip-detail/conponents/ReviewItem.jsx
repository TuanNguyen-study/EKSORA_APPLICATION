// app/(stack)/trip-detail/components/ReviewItem.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

// Component StarRating (có thể import từ ProductBasicInfo hoặc tạo file riêng)
const StarRatingDisplay = ({ rating, size = 14, color = COLORS.warning }) => {
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


const ReviewItem = ({ review }) => {
  return (
    <View style={styles.reviewItemContainer}>
      <View style={styles.reviewerInfo}>
        <Image source={{ uri: review.userAvatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
        <View style={styles.reviewerText}>
          <Text style={styles.reviewerName}>{review.userName}</Text>
          <View style={styles.reviewMeta}>
             <StarRatingDisplay rating={review.rating} />
            <Text style={styles.reviewDate}> • {review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      {review.images && review.images.length > 0 && (
        <FlatList
          data={review.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(img) => img.id}
          renderItem={({ item: img }) => (
            <Image source={{ uri: img.uri }} style={styles.reviewImage} />
          )}
          style={styles.reviewImagesContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerText: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  reviewImagesContainer: {
    marginTop: 5,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: COLORS.border,
  },
});

export default ReviewItem;