import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 240;
const CARD_MARGIN = 15;
const IMAGE_HEIGHT = 180;

const TourCards = ({ tours, onTourPress }) => {
  if (!tours || tours.length === 0) {
    return null;
  }

  const renderTourCard = ({ item, index }) => (
    <TourCard
      tour={item}
      onPress={() => onTourPress && onTourPress(item)}
      isFirst={index === 0}
      isLast={index === tours.length - 1}
    />
  );

  const getItemLayout = (data, index) => ({
    length: CARD_WIDTH + (CARD_MARGIN * 2),
    offset: (CARD_WIDTH + (CARD_MARGIN * 2)) * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={tours}
        renderItem={renderTourCard}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToInterval={CARD_WIDTH + (CARD_MARGIN * 2)}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled={false}
        bounces={false}
        getItemLayout={getItemLayout}
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
      />
      
      {tours.length > 1 && (
        <View style={styles.scrollIndicator}>
          <View style={styles.scrollDots}>
            {tours.slice(0, Math.min(4, tours.length)).map((_, index) => (
              <View key={index} style={styles.dot} />
            ))}
            {tours.length > 4 && <Text style={styles.moreText}>+{tours.length - 4}</Text>}
          </View>
        </View>
      )}
    </View>
  );
};

const TourCard = ({ tour, onPress, isFirst, isLast }) => {
  const formatPrice = (price) => {
    if (!price) return '0đ';
    const numPrice = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price;
    
    if (numPrice >= 1000000) {
      const millions = numPrice / 1000000;
      return millions % 1 === 0 
        ? `${millions} triệu đ` 
        : `${millions.toFixed(1)} triệu đ`;
    } else if (numPrice >= 1000) {
      return `${Math.floor(numPrice / 1000)}.${String(numPrice % 1000).padStart(3, '0')}đ`;
    }
    return `${numPrice}đ`;
  };

  const renderStars = (rating) => {
    const ratingValue = rating ? parseFloat(rating) : 5.0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={17}
          color={i <= ratingValue ? "#FFD700" : "#E0E0E0"}
          style={styles.starIcon}
        />
      );
    }
    
    return stars;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isFirst && styles.firstCard,
        isLast && styles.lastCard
      ]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: tour.image || tour.imageUrl || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73273?w=400&h=200&fit=crop'
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content với layout cố định */}
      <View style={styles.contentContainer}>
        
        {/* Title Section - Chiều cao cố định */}
        <View style={styles.titleSection}>
          <Text style={styles.tourName} numberOfLines={2}>
            {tour.name || tour.title || 'Tour không tên'}
          </Text>
        </View>
        
        {/* Rating Section - Chiều cao cố định với 5 ngôi sao */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingRow}>
            <View style={styles.ratingLeft}>
              {/* Container cho 5 ngôi sao */}
              <View style={styles.starsContainer}>
                {renderStars(tour.rating)}
              </View>
              
              <Text style={styles.ratingNumber}>
                {tour.rating ? parseFloat(tour.rating).toFixed(1) : '5.0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Location Section - Chiều cao cố định */}
        <View style={styles.locationSection}>
          {tour.location ? (
            <View style={styles.locationRow}>
              <Icon name="location-on" size={16} color="#000000ff" />
              <Text style={styles.locationText} numberOfLines={1}>
                {tour.location}
              </Text>
            </View>
          ) : (
            <View style={styles.locationPlaceholder} />
          )}
        </View>

        {/* Flexible Space */}
        <View style={styles.flexSpace} />

        {/* Price Section - Luôn ở cuối */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.pricePrefix}>Chỉ từ: </Text>
            <Text style={styles.priceText}>
              {formatPrice(tour.price || tour.adultPrice || '750000')}
            </Text>
          </View>
          
          {/* Additional Info */}
          {(tour.duration || tour.maxTickets) && (
            <View style={styles.additionalInfo}>
              {tour.duration && (
                <View style={styles.infoItem}>
                  <Icon name="schedule" size={12} color="#666" />
                  <Text style={styles.infoText}>{tour.duration}</Text>
                </View>
              )}
           
            </View>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
  },
  flatListContent: {
    paddingHorizontal: 5,
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 7, 
  },
  scrollDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 30, 
    height: 4,
    borderRadius: 3,
    backgroundColor: '#ffffffff', 
    marginHorizontal: 2, 
  },
  moreText: {
    fontSize: 11, 
    color: '#e0e0e0ff', 
    marginLeft: 6,
    fontWeight: '500',
  },

  card: {
    width: CARD_WIDTH,
    height: 340,
    marginHorizontal: CARD_MARGIN, 
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 6, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  firstCard: {
    marginLeft: CARD_MARGIN, 
  },
  lastCard: {
    marginRight: CARD_MARGIN, 
  },

  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: '#f5f5f5',
    position: 'relative',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  contentContainer: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',
  },

  titleSection: {
    height: 44,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  tourName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 22,
  },

  ratingSection: {
    height: 24,
    marginBottom: 6,
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Styles má»›i cho stars container
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  starIcon: {
    marginRight: 1,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 2,
  },

  locationSection: {
    height: 20,
    marginBottom: 6,
    
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  locationPlaceholder: {
    height: 20, 
  },

  flexSpace: {
    flex: 1,
  },

  priceSection: {
   
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pricePrefix: {
    fontSize: 17,
    color: '#000000ff',
    marginLeft: 3,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginLeft: 4,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 11,
    color: '#7f8c8d',
    marginLeft: 4,
  },
});

export default TourCards;