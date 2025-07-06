import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import TripHeader from '../ScheduleTrip/Component/TripHeader';
import TripTabs from '../ScheduleTrip/Component/TripTabs';
import ItineraryList from '../ScheduleTrip/Component/ItineraryList';
import TripInfoSection from '../ScheduleTrip/Component/TripInfoSection';
import PriceFooter from '../ScheduleTrip/Component/PriceFooter';

const itineraryData = [
  {
    day: 'Điểm đến 1',
    date: '09 thg 7 2025',
    places: 10,
    distance: '37.4 km',
    image: 'https://thanhnien.mediacdn.vn/Uploaded/quochung-qc/2021_10_18/meyhomes-1-9993.png',
  },
  {
    day: 'Điểm đến 2',
    date: '09 thg 7 2025',
    places: 9,
    distance: '25 km',
    image: 'https://thanhnien.mediacdn.vn/Uploaded/quochung-qc/2021_10_18/meyhomes-1-9993.png',
  },
  {
    day: 'Điểm đến 3',
    date: '09 thg 7 2025',
    places: 8,
    distance: '20 km',
    image: 'https://thanhnien.mediacdn.vn/Uploaded/quochung-qc/2021_10_18/meyhomes-1-9993.png',
  },
];

export default function TripDetailScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TripHeader />
        <TripTabs />
        <ItineraryList data={itineraryData} />
        <TripInfoSection /> 
      </ScrollView>
      <PriceFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});