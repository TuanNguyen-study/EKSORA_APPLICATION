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


  // Hàm lưu tour 
  const saveScheduleToStorage = async (userId, scheduleData) => {
    if (!userId || !Array.isArray(scheduleData)) return;

    const STORAGE_KEY = `savedSchedule_${userId}_${cateID}`;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
    } catch (error) {
      console.error('Lỗi khi lưu lịch trình:', error);
    }
  };

  const loadSavedSchedule = async () => {
    const userId = await AsyncStorage.getItem('USER_ID');
    if (!userId) return null;

    const STORAGE_KEY = `savedSchedule_${userId}_${cateID}`;
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Lỗi khi load lịch trình:', error);
      return null;
    }
  };



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
 const handleRemovePlace = async (index) => {
  const newData = [...data];
  if (index > 0 && newData[index - 1]?.connector) {
    newData.splice(index - 1, 2); // xóa connector + item
  } else {
    newData.splice(index, 1);
  }
  setData(newData);

  try {
    const userId = await AsyncStorage.getItem('USER_ID');
    await saveScheduleToStorage(userId, newData);
  } catch (error) {
    console.error('Lỗi khi lưu lịch trình:', error);
  }
};



  //Nút di chuyển lên
  const moveItemUp = async (index) => {
  if (index <= 1) return; // bỏ qua nếu item ở đầu
  const newData = [...data];
  const temp = newData[index];
  newData[index] = newData[index - 2];
  newData[index - 2] = temp;
  setData(newData);
  try {
    const userId = await AsyncStorage.getItem('USER_ID');
    await saveScheduleToStorage(userId, newData);
  } catch (error) {
    console.error('Lỗi khi lưu lịch trình:', error);
  }
};


  //nút di chuyển xuống
  const moveItemDown = async (index) => {
  if (index >= data.length - 2) return; // bỏ qua nếu item ở cuối
  const newData = [...data];
  const temp = newData[index];
  newData[index] = newData[index + 2];
  newData[index + 2] = temp;
  setData(newData);

  try {
    const userId = await AsyncStorage.getItem('USER_ID');
    await saveScheduleToStorage(userId, newData);
  } catch (error) {
    console.error('Lỗi khi lưu lịch trình:', error);
  }
};


  // hàm thêm tour 
  const handleAddTour = async (newTour) => {
    const exists = data.some(item => item?.id === newTour._id);
    if (exists) return;
    const newItem = {
      id: newTour._id,
      name: newTour.name,
      image: Array.isArray(newTour.image) ? newTour.image[0] : newTour.image,
      isBooked: false,
      isAdded: true,
    };

    const newData = [...data];
    if (newData.length > 0) {
      newData.push({ connector: true });
    }
    newData.push(newItem);
    setData(newData);
    const userId = await AsyncStorage.getItem('USER_ID'); 
    await saveScheduleToStorage(userId, newData);
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
          // lưu lich trình
          const saved = await loadSavedSchedule();
          if (saved && saved.length > 0) {
            setData(saved);
            return; // Không fetch random nữa nếu đã có lịch trình
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
          const randomTours = getRandomTours(tours, 5);
          // 2. Gọi API lấy danh sách tour đã đặt
          const bookings = await getUserBookings(userId);
          // 3. Lấy danh sách các tour đã đặt
          const bookedIds = bookings.map(booking => booking.tour_id?._id);
          setBookedTourIds(bookedIds);
          // 4. Gán data + trạng thái, đưa tour đã đặt lên trước
          const sortedTours = [...randomTours].sort((a, b) => {
            const aBooked = bookedIds.includes(a._id);
            const bBooked = bookedIds.includes(b._id);
            return bBooked - aBooked; // tour đã đặt true > false
          });

          const newData = sortedTours.flatMap((tour, index) => {
            const isBooked = bookedIds.includes(tour._id);
            const item = {
              id: tour._id,
              name: tour.name,
              image: tour.image?.[0],
              isBooked,
            };
            return index < sortedTours.length - 1
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
        data={limitToursWithConnectors(data, 7)}
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
