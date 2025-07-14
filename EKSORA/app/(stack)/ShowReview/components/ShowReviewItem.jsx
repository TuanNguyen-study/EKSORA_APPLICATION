// components/ReviewItem.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ShowReviewItem = ({ review }) => {
  if (!review) return null;

  const name = review.userName || 'Ẩn danh';
  const initial = name.charAt(0).toUpperCase();
  const date = review.date || 'Không rõ ngày';
  const rating = typeof review.rating === 'number' ? review.rating.toFixed(1) : '0.0';
  const ratingText = `Đánh giá: ${rating}/5`;
  const comment = review.comment?.trim() || '(Không có nội dung)';
  const images = Array.isArray(review.images) && review.images.length > 0 ? review.images : [];

  return (
    <View style={styles.container}>
      <View style={styles.userInfoHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{ratingText}</Text>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingNumber}>{rating}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.reviewContent}>{comment}</Text>

      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.slice(0, 5).map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDA0DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingText: {
    color: '#28a745', // Màu xanh lá cây
    fontSize: 14,
    marginBottom: 4,
  },
  ratingBox: {
    backgroundColor: '#E6F3FF', // Màu xanh dương nhạt
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingNumber: {
    color: '#007BFF', // Màu xanh dương đậm
    fontWeight: 'bold',
  },
  reviewForContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  reviewForText: {
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  reviewContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  originalReviewLink: {
    color: '#333',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between', // Nếu muốn các ảnh cách đều
  },
  image: {
    width: '32%', // ~1/3 màn hình trừ đi khoảng cách
    aspectRatio: 1, // Để ảnh vuông
    borderRadius: 8,
    marginBottom: '2%',
    marginRight: '2%',
  },
});

export default ShowReviewItem;