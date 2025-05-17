import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import DestinationCard from '../../../components/home/DestinationCard';
import { useDispatch } from 'react-redux';
import { setSelectedTrip } from '../../../store/tripSlice';
import { useRouter } from 'expo-router';

const destinations = [
  { id: '1', name: 'Paris' },
  { id: '2', name: 'Tokyo' },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePress = (item) => {
    console.log('Chọn:', item);
    dispatch(setSelectedTrip(item));
    router.push('/trip-detail');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Destinations</Text>
      <FlatList
        data={destinations}
        renderItem={({ item }) => (
          <DestinationCard
            destination={item}
            onPress={() => handlePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
});