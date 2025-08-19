import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";
import CouponModal from "../../Voucher/CouponModal";

// Component 1: Hiển thị đánh giá sao
const StarRating = ({ rating, size = 18, color = COLORS.warning }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <Ionicons key={`full_${i}`} name="star" size={size} color={color} />
        ))}
      {halfStar && (
        <Ionicons key="half" name="star-half-sharp" size={size} color={color} />
      )}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <Ionicons
            key={`empty_${i}`}
            name="star-outline"
            size={size}
            color={color}
          />
        ))}
    </View>
  );
};

// Component 2: Hiển thị giải thưởng đối tác
const PartnerAwards = ({ awards }) => (
  <View style={styles.awardsBadgeOuterContainer}>
    <View style={styles.awardsBadgeContainer}>
      <Image source={awards.image} style={styles.awardsImage} />
      <View>
        <Text style={styles.awardsTextLine1}>{awards.line1}</Text>
        <View style={styles.awardsTextLine2Container}>
          <Text style={styles.awardsYear}>{awards.year}</Text>
          <Text style={styles.awardsTextLine2}>{awards.line2}</Text>
        </View>
      </View>
    </View>
  </View>
);

// Component 3: Hiển thị các tag
const ProductTags = ({ tags }) => (
  <View style={styles.tagsContainer}>
    {tags.map((tag, index) => (
      <View key={tag.label || `tag-${index}`} style={styles.tagChip}>
        <Text style={styles.tagText}>{tag.label}</Text>
      </View>
    ))}
  </View>
);

// Component 4: Section "Ưu đãi cho bạn"
const OffersSection = ({ offers, onApplyVoucher, selectedVoucher }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSeeOffers = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <>
      <TouchableOpacity style={styles.offersSection} onPress={handleSeeOffers}>
        <Text style={styles.offersTitle}>Ưu đãi cho bạn</Text>

        <View style={styles.rightContentContainer}>
          <View style={styles.offerTagsContainer}>
            {offers.slice(0, 2).map((offer, index) => (
              <View
                key={offer.label || offer.id || `offer-${index}`}
                style={[
                  styles.offerTag,
                  { backgroundColor: offer.bgColor || COLORS.primaryLight },
                ]}
              >
                {offer.icon && (
                  <Ionicons
                    name={offer.icon}
                    size={14}
                    color={offer.textColor || COLORS.primary}
                  />
                )}
                <Text
                  style={[
                    styles.offerTagText,
                    { color: offer.textColor || COLORS.primary },
                  ]}
                >
                  {offer.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>

      {/* THAY ĐỔI 2: Gọi CouponModal thay vì VoucherModal */}
      {/* Các props onApplyVoucher và selectedVoucher không cần thiết cho CouponModal nên có thể xóa */}
      <CouponModal visible={isModalVisible} onClose={handleCloseModal} />
    </>
  );
};

// --- COMPONENT CHÍNH ---
const ProductBasicInfo = ({ productInfo, onApplyVoucher, selectedVoucher }) => {
  if (!productInfo) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* 1. Giải thưởng */}
      {productInfo.partnerAwards && (
        <PartnerAwards awards={productInfo.partnerAwards} />
      )}

      {/* 2. Tên và điểm khởi hành */}
      <Text style={styles.productName}>{productInfo.name}</Text>
      {productInfo.departurePoint && (
        <Text style={styles.departureText}>
          Khởi hành từ: {productInfo.departurePoint}
        </Text>
      )}

      {/* 3. Đánh giá */}
      {productInfo.rating && (
        <View style={styles.ratingBookingRow}>
          <StarRating rating={productInfo.rating?.stars} />
          <Text style={styles.ratingValue}>
            {productInfo.rating.stars.toFixed(1)}
          </Text>
          <Text style={styles.ratingCount}>
            (
            {productInfo.rating.detailsText ||
              `${productInfo.rating.count} Đánh giá`}
            )
          </Text>
        </View>
      )}

      {/* 4. Tags */}
      {productInfo.tags?.length > 0 && <ProductTags tags={productInfo.tags} />}

      {/* 5. Ưu đãi */}
      {productInfo.offers?.length > 0 && (
        <OffersSection
          offers={productInfo.offers}
          onApplyVoucher={onApplyVoucher}
          selectedVoucher={selectedVoucher}
        />
      )}
    </View>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 10,
    lineHeight: 32,
  },
  departureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  awardsBadgeOuterContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  awardsBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  awardsImage: {
    width: 30,
    height: 35,
    resizeMode: "contain",
    marginRight: 10,
  },
  awardsTextLine1: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  awardsTextLine2Container: {
    flexDirection: "row",
    alignItems: "center",
  },
  awardsYear: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "bold",
    marginRight: 4,
  },
  awardsTextLine2: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "bold",
  },

  ratingBookingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 6,
  },
  ratingCount: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "bold",
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  offersSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 16,
  },
  rightContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  offerTagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: 8,
  },
  offerTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 6,
  },
  offerTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ProductBasicInfo;
