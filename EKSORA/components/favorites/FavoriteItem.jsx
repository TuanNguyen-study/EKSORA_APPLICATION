import { Image, StyleSheet, Text, View } from 'react-native';

export default function FavoriteItem({ title, location, description, price, image }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.heart}>❤️</Text>
        </View>

        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
            {location}
          </Text>
          <Text style={styles.price}>Từ {price} đ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f6fafd',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
  },
  heart: {
    fontSize: 16,
    color: 'red',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: 170, // Giới hạn độ dài location để giá không bị đẩy
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e63946',
    textAlign: 'right',
    minWidth: 90,
    flexShrink: 0,
    flexGrow: 0,
  },
});
