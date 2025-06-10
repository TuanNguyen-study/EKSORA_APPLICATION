import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors'; 

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth - 32; 

const ServiceDescriptionSection = ({ title, descriptionContent }) => {

  if (!descriptionContent || descriptionContent.length === 0) {
    return null;
  }

  const renderContentItem = (item, index) => {
    if (item.type === 'text') {
      return (
        <Text key={`desc_text_${index}`} style={styles.descriptionText}>
          {item.content}
        </Text>
      );
    }
    if (item.type === 'image') {
      return (
        <View key={`desc_img_${index}`} style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.imageStyle} />
          {item.caption && <Text style={styles.imageCaption}>{item.caption}</Text>}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIndicator} />
        <Text style={styles.sectionTitle}>{title || "Về dịch vụ này"}</Text>
      </View>

      {descriptionContent.map(renderContentItem)}
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
    marginBottom: 12,
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
  descriptionText: {
    fontSize: 15,
    lineHeight: 24, 
    color: COLORS.textSecondary,
    textAlign: 'justify', 
    marginBottom: 16, 
  },
  imageContainer: {
    marginBottom: 16,
    alignItems: 'center', 
  },
  imageStyle: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 0.6, 
    borderRadius: 12, 
    backgroundColor: COLORS.border, 
  },
  imageCaption: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
});

export default ServiceDescriptionSection;