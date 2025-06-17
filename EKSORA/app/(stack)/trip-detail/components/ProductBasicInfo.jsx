
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../../constants/colors';

// Component StarRating
const StarRating = ({ rating, size = 18, color = COLORS.warning }) => { 
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let stars = [];
  for (let i = 0; i < fullStars; i++) stars.push(<Ionicons key={`full_${i}`} name="star" size={size} color={color} />);
  if (halfStar) stars.push(<Ionicons key="half" name="star-half-sharp" size={size} color={color} />);
  for (let i = 0; i < emptyStars; i++) stars.push(<Ionicons key={`empty_${i}`} name="star-outline" size={size} color={color} />);
  return <View style={styles.starContainer}>{stars}</View>;
};

const ProductBasicInfo = ({ productInfo, onSeeAllReviews, onSeeMoreHighlights, onSeeOffers }) => {
  if (!productInfo) {
    return null; 
  }

  return (
    <View style={styles.container}>
      {/* Partner Awards Badge */}
      {productInfo.partnerAwards && (
        <View style={styles.awardsBadgeOuterContainer}> 
          <View style={styles.awardsBadgeContainer}>
            <Image source={productInfo.partnerAwards.image} style={styles.awardsImage} />
            <View style={styles.awardsTextContainer}>
              <Text style={styles.awardsTextLine1}>{productInfo.partnerAwards.line1}</Text>
              <View style={styles.awardsTextLine2Container}>
                <Text style={styles.awardsYear}>{productInfo.partnerAwards.year}</Text>
                <Text style={styles.awardsTextLine2}>{productInfo.partnerAwards.line2}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Tên sản phẩm */}
      <Text style={styles.productName}>{productInfo.name}</Text>

      {/* Thông tin Khởi hành */}
      {productInfo.departurePoint && (
        <Text style={styles.departureText}>Khởi hành từ {productInfo.departurePoint}</Text>
      )}

      {/* Dòng Đánh giá và Đã đặt */}
      {productInfo.rating && (
        <View style={styles.ratingBookingRow}>
          <StarRating rating={productInfo.rating.stars} />
          <Text style={styles.ratingValue}>{productInfo.rating.stars.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({productInfo.rating.detailsText || `${productInfo.rating.count} Đánh giá`})</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.bookingCount}>{productInfo.bookingCount || '9K+'} Đã đặt</Text>
        </View>
      )}

      {/* Tags/Chips */}
      {productInfo.tags && productInfo.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {productInfo.tags.map((tag, index) => (
            <View key={index} style={[styles.tagChip, tag.isSpecial && styles.specialTagChip]}>
              <Text style={[styles.tagText, tag.isSpecial && styles.specialTagText]}>{tag.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Box Thông tin Nổi bật Tóm tắt */}
      {productInfo.summaryHighlight && (
        <View style={styles.summaryHighlightBox}>
          <View style={styles.summaryHighlightContent}>
            {productInfo.summaryHighlight.items.map((item, index) => (
              <Text key={index} style={styles.summaryHighlightItem}>• {item}</Text>
            ))}
            <TouchableOpacity onPress={onSeeMoreHighlights}>
              <Text style={styles.seeMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {productInfo.summaryHighlight.logo && (
            <View style={styles.summaryLogoContainer}>
              <Image source={productInfo.summaryHighlight.logo} style={styles.summaryLogo} />
              <Text style={styles.summaryLogoText}>{productInfo.summaryHighlight.logoText || "EKSORA"}</Text>
            </View>
          )}
        </View>
      )}

      {/* Ưu đãi cho bạn */}
      {productInfo.offers && productInfo.offers.length > 0 && (
        <TouchableOpacity style={styles.offersSection} onPress={onSeeOffers}>
          <Text style={styles.offersTitle}>Ưu đãi cho bạn</Text>
          <View style={styles.offerTagsContainer}>
            {productInfo.offers.slice(0, 2).map((offer, index) => (
              <View key={index} style={[styles.offerTag, { backgroundColor: offer.bgColor || COLORS.primaryLight }]}>
                {offer.icon && <Ionicons name={offer.icon} size={14} color={offer.textColor || COLORS.primary} style={{ marginRight: 4 }} />}
                <Text style={[styles.offerTagText, { color: offer.textColor || COLORS.primary }]}>{offer.label}</Text>
              </View>
            ))}
          </View>
          <Ionicons name="chevron-forward-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  awardsBadgeOuterContainer: { 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 16, 
  },
  awardsBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,

  },
  awardsImage: {
    width: 30, 
    height: 35,
    resizeMode: 'contain',
    marginRight: 10,
  },
  awardsTextContainer: {},
  awardsTextLine1: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  awardsTextLine2Container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  awardsYear: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: 'bold',
    marginRight: 4,
  },
  awardsTextLine2: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: 'bold',
  },

  productName: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 32,
  },

  departureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  ratingBookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starContainer: { 
    flexDirection: 'row',
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 6,
  },
  ratingCount: {
    fontSize: 15,
    color: COLORS.text, 
    fontWeight: 'bold',
    marginLeft: 4,
  },
  dotSeparator: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  bookingCount: {
    fontSize: 15,
    color: COLORS.textSecondary, 
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: COLORS.border, 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  specialTagChip: {

  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary, 
  },
  specialTagText: {

  },

  summaryHighlightBox: {
    backgroundColor: '#E9F5FE', 
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
    marginBottom: 20,
  },
  summaryHighlightContent: {
    flex: 1, 
  },
  summaryHighlightItem: {
    fontSize: 14,
    color: COLORS.text, 
    lineHeight: 20,
    marginBottom: 6,
  },
  seeMoreText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text, 
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  summaryLogoContainer: {
    alignItems: 'center',
    marginLeft: 10, 
  },
  summaryLogo: {
    width: 40, 
    height: 40,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  summaryLogoText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  // Offers Section
  offersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  offerTagsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 8,
  },
  offerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  offerTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProductBasicInfo;