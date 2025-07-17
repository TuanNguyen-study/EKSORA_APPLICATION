import React, { useEffect, useState, useCallback} from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScheduleHeader from '../ScheduleDetail/Components/ScheduleHeader';
import PlaceItem from '../ScheduleDetail/Components/PlaceItem';
import TimelineConnector from '../ScheduleDetail/Components/TimelineConnector';
import AddButton from '../ScheduleDetail/Components/AddButton';
import { getToursByLocation } from '../../../API/services/serverCategories'
import { useFocusEffect } from '@react-navigation/native';


const Index = () => {
  const { tourImages, cateID, tourName} = useLocalSearchParams();
  const images = JSON.parse(tourImages || '[]');
  const [data, setData] = useState([]);
  

  useFocusEffect(
  useCallback(() => {
    const fetchTours = async () => {
      if (!cateID) return;
      try {
        const res = await getToursByLocation(cateID);
        const tours = res.data || res;

        const getRandomTours = (array, count) => {
          const shuffled = [...array].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };

        const randomTours = getRandomTours(tours, 3);

        const newData = randomTours.flatMap((tour, index) => {
          const item = {
            id: tour._id,
            name: tour.name,
            image: tour.image?.[0],
            startTime: '08:00',
          };
          return index < randomTours.length - 1
            ? [item, { connector: true }]
            : [item];
        });

        setData(newData);
      } catch (e) {
        console.error('Lỗi khi load tour theo cateID:', e);
      }
    };

    fetchTours();
  }, [cateID])
);
  return (
    <View style={styles.container}>
      <ScheduleHeader />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{tourName}</Text>
      </View>

      <FlatList
        data={data}
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
