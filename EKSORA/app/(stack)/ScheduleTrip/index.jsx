import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TripHeader from '../ScheduleTrip/Component/TripHeader';
import TripTabs from '../ScheduleTrip/Component/TripTabs';
import ItineraryList from '../ScheduleTrip/Component/ItineraryList';
import TripInfoSection from '../ScheduleTrip/Component/TripInfoSection';
import PriceFooter from '../ScheduleTrip/Component/PriceFooter';

export default function TripDetailScreen() {
  const params = useLocalSearchParams();
  const images = JSON.parse(params?.tourImages || '[]');

  const itineraryData = [
    {
      day: 'Điểm đến 1',
      date: '09 thg 7 2025',
      places: 3,
      distance: '37',
      image: images[0],
    },
    {
      day: 'Điểm đến 2',
      date: '09 thg 7 2025',
      places: 9,
      distance: '25',
      image: images[1],
    },
    {
      day: 'Điểm đến 3',
      date: '09 thg 7 2025',
      places: 8,
      distance: '20',
      image: images[2],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <TripHeader />
        <TripTabs />
        <ItineraryList data={itineraryData} tourImages={images} />
        <TripInfoSection />
      </ScrollView>
      <PriceFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
