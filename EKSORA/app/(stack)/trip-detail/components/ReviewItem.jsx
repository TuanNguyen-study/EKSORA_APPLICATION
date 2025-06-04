
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const REVIEW_CARD_WIDTH = screenWidth * 0.8;

// Component StarRatingDisplay 
const StarRatingDisplay = ({ rating, size = 12, color = COLORS.warning }) => {
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


const ReviewItem = ({ review, style }) => { 
  return (
    <View style={[styles.reviewCard, style]}>
      <View style={styles.reviewerHeader}>
        <Image source={{ uri: review.userAvatar || 'https://i.pravatar.cc/80' }} style={styles.avatar} />
        <View style={styles.reviewerDetails}>
          <Text style={styles.reviewerName} numberOfLines={1}>{review.userName}</Text>
          {/* Hiển thị đánh giá sao của reviewer này */}
          <View style={styles.reviewerRating}>
             <StarRatingDisplay rating={review.rating} size={14} />
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment} numberOfLines={4}> 
        {review.comment}
      </Text>
      {review.date && <Text style={styles.reviewDateText}>{review.date}</Text> }
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    width: REVIEW_CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 12, 
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 150, 
    justifyContent: 'space-between', 
  },
  reviewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24, 
    marginRight: 12,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviewerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    flexGrow: 1, 
    marginBottom: 8,
  },
  reviewDateText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 'auto'
  }
});

export default ReviewItem;