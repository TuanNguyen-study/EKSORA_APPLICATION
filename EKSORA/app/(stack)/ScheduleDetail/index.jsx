import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { getToursByLocation } from '../../../API/services/serverCategories';
import AddButton from '../ScheduleDetail/Components/AddButton';
import PlaceItem from '../ScheduleDetail/Components/PlaceItem';
import ScheduleHeader from '../ScheduleDetail/Components/ScheduleHeader';
import TimelineConnector from '../ScheduleDetail/Components/TimelineConnector';


const Index = () => {
  const { tourImages, cateID, tourName } = useLocalSearchParams();
  const images = JSON.parse(tourImages || '[]');
  const [data, setData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);



 const handleRemovePlace = (indexToRemove) => {
  const newData = [...data];

  // tour là cuối cùng và phía trước là connector thì xoá cả connector
  if (
    indexToRemove === newData.length - 1 && 
    newData[indexToRemove - 1]?.connector
  ) {
    newData.splice(indexToRemove - 1, 2); // xoá connector và item
  }
  // sau item là connector thì xoá cả item và connector
  else if (newData[indexToRemove + 1]?.connector) {
    newData.splice(indexToRemove, 2);
  }
  // Chỉ là 1 item riêng thì xoá item
  else {
    newData.splice(indexToRemove, 1);
  }

  setData(newData);

  Alert.alert('Đã xoá', 'Bạn đã xoá tour khỏi lịch trình');
}

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
        renderItem={({ item, index }) =>
          item.connector ? (
            <TimelineConnector distance={item.distance} duration={item.duration} />
          ) : (
            <PlaceItem
              item={item}
              onRemove={() => handleRemovePlace(index)}
            />
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
