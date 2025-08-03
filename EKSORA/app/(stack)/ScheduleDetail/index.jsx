import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { getToursByLocation } from '../../../API/services/serverCategories';
import { getUserBookings } from '../../../API/services/servicesUser';
import ModalAddTour from '../ScheduleDetail/Components/ModalAddTous';
import PlaceItem from '../ScheduleDetail/Components/PlaceItem';
import ScheduleHeader from '../ScheduleDetail/Components/ScheduleHeader';
import TimelineConnector from '../ScheduleDetail/Components/TimelineConnector';
import AddButton from './Components/AddButton';


const Index = () => {
  const { tourImages, cateID, tourName } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookedTourIds, setBookedTourIds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedTours, setSavedTours] = useState([]);


  //Hàm xử lý hiển thị tối đa số Item
  const limitToursWithConnectors = (data, maxItems) => {
    const result = [];
    let count = 0;

    for (let i = 0; i < data.length && count < maxItems; i++) {
      const item = data[i];
      result.push(item);
      if (item.name) {
        count++;
      }
    }
    return result;
  };



  // xử lý nút xoá item
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


  //Nút di chuyển lên
  const moveItemUp = (index) => {
    if (index <= 0) return;

    const newData = [...data];

    // Di chuyển cả item và connector nếu có
    if (newData[index + 1]?.connector) {
      const item = newData.splice(index, 2); // lấy item + connector
      newData.splice(index - 1, 0, ...item); // chèn lên
    } else {
      const item = newData.splice(index, 1);
      newData.splice(index - 1, 0, ...item);
    }
    setData(newData);
  };



  //nút di chuyển xuống
  const moveItemDown = (index) => {
    if (index >= data.length - 1) return;

    const newData = [...data];

    if (newData[index + 1]?.connector) {
      const item = newData.splice(index, 2); // item + connector
      newData.splice(index + 1, 0, ...item); // chèn xuống
    } else {
      const item = newData.splice(index, 1);
      newData.splice(index + 1, 0, ...item);
    }

    setData(newData);
  };



  // hàm thêm tour 
  const handleAddTour = (newTour) => {
    const exists = data.some(item => item?.id === newTour._id);
    if (exists) return;

    const newItem = {
      id: newTour._id,
      name: newTour.name,
      image: Array.isArray(newTour.image) ? newTour.image[0] : newTour.image,
      isBooked: bookedTourIds.includes(newTour._id),
    };

    // Nếu đã có phần tử trong data thì chèn thêm connector
    const newData = [...data];
    if (newData.length > 0) {
      newData.push({ connector: true });
    }
    newData.push(newItem);

    setData(newData);
    setModalVisible(false);
  };




  // Gọi API
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!cateID) return;
        setLoading(true);
        try {
          // Lấy userId từ AsyncStorage
          const userId = await AsyncStorage.getItem('USER_ID');
          if (!userId) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
            return;
          }
          // 1. Lấy tất cả tour
          const res = await getToursByLocation(cateID);
          const tours = res.data || res;
          // random tour
          const getRandomTours = (array, count) => {
            const filtered = array.filter(t => t.name && t.image && t.image.length > 0);
            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
          };
          const randomTours = getRandomTours(tours, 3);
          // 2. Gọi API lấy danh sách tour đã đặt
          const bookings = await getUserBookings(userId);
          // 3. Lấy danh sách các tour đã đặt
          const bookedIds = bookings.map(booking => booking.tour_id?._id);
          setBookedTourIds(bookedIds);
          // 4. Gán data + trạng thái
          const newData = randomTours.flatMap((tour, index) => {
            const isBooked = bookedIds.includes(tour._id);
            const item = {
              id: tour._id,
              name: tour.name,
              image: tour.image?.[0],
              isBooked,
            };
            return index < randomTours.length - 1
              ? [item, { connector: true }]
              : [item];
          });
          setData(newData);
        } catch (e) {
          console.error('Lỗi khi load tour theo cateID:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [cateID])
  );



  return (
    <View style={styles.container}>
      <ScheduleHeader />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{tourName}</Text>
      </View>

      <FlatList
        data={limitToursWithConnectors(data, 5)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          // Nếu item rỗng thì không render gì cả
          if (!item || !item.name) return null;

          // Kiểm tra item kế tiếp có hợp lệ không để vẽ connector
          const nextValidItem = data.slice(index + 1).find(
            nextItem => nextItem && nextItem.name
          );

          return (
            <View>
              <PlaceItem
                item={item}
                onRemove={() => handleRemovePlace(index)}
                onMoveUp={() => moveItemUp(index)}
                onMoveDown={() => moveItemDown(index)}
              />
              {nextValidItem && <TimelineConnector />}
            </View>
          );
        }}
      />
      <AddButton onPress={() => setModalVisible(true)} />

      <ModalAddTour
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTour={handleAddTour}
        cateID={cateID} // truyền cateID vào để modal tự fetch tour theo danh mục
        existingTourIds={data.filter(item => item?.id).map(t => t.id)}// lọc những tour đã có 
      />

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
