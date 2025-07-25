import { Image, StyleSheet, Text, View } from 'react-native';

export default function EmptyTrips() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/tripsImage.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Chưa có chuyến đi sắp tới...!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#999',
  },
});
