import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScheduleHeader from '../ScheduleDetail/Components/ScheduleHeader';
import PlaceItem from '../ScheduleDetail/Components/PlaceItem';
import TimelineConnector from '../ScheduleDetail/Components/TimelineConnector';
import AddButton from '../ScheduleDetail/Components/AddButton';

const Index = () => {
const { tourImages } = useLocalSearchParams();
const images = JSON.parse(tourImages || '[]');
console.log("Ảnh nhận được:", images);



  const DATA = [
    {
      id: '1',
      name: 'Điểm đến 1',
      image: images[0] ,
      visitDuration: '2h',
      startTime: '08:00',
    },
    {
      connector: true,
      distance: '2.0 km',
      duration: '6p',
    },
    {
      id: '2',
      name: 'Điểm đến 2',
      image: images[1],
      visitDuration: '30p',
      startTime: '10:06',
    },
    {
      connector: true,
      distance: '24.2 km',
      duration: '34p',
    },
    {
      id: '3',
      name: 'Điểm đến 3',
      image: images[2],
      visitDuration: '30p',
      startTime: '11:00',
    },
  ];

  return (
    <View style={styles.container}>
      <ScheduleHeader />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Ngày Tham Quan • 09/07/2025 • 68.5 km • 3 địa điểm</Text>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item.connector ? (
            <TimelineConnector distance={item.distance} duration={item.duration} />
          ) : (
            <PlaceItem item={item} />
          )
        }
      />

      <AddButton onPress={() => console.log('Thêm địa điểm')} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  summary: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
  },
});
