import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { getAllToursByLocation, getToursByLocation } from '../../../API/services/serverCategories';
import { getUserBookings } from '../../../API/services/servicesUser';
import ModalAddTour from '../ScheduleDetail/Components/ModalAddTous';
import PlaceItem from '../ScheduleDetail/Components/PlaceItem';
import ScheduleHeader from '../ScheduleDetail/Components/ScheduleHeader';
import TimelineConnector from '../ScheduleDetail/Components/TimelineConnector';
import AddButton from './Components/AddButton';

const Index = () => {
  const { cateID } = useLocalSearchParams();
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

  // Hàm load lịch trình đã lưu
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

  // Giới hạn số item hiển thị
  const limitToursWithConnectors = (data, maxItems) => {
    const result = [];
    let count = 0;
    for (let i = 0; i < data.length && count < maxItems; i++) {
      const item = data[i];
      result.push(item);
      if (item.name) count++;
    }
    return result;
  };

  // Reset lịch trình mới từ API
  const resetSchedule = async (userId) => {
    try {
      setLoading(true);
      let res = await getToursByLocation(cateID);
      let tours = res.data || res;
      tours = tours.filter(t => t.name && t.image && t.image.length > 0);

      // Nếu chỉ có 1 tour, random thêm từ cùng danh mục (ALL)
      if (tours.length === 1) {
        const resAll = await getAllToursByLocation(cateID);
        const allTours = (resAll.data || resAll).filter(
          t => t.name && t.image && t.image.length > 0
        );
        const extraTours = allTours
          .filter(t => t._id !== tours[0]._id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        tours = [...tours, ...extraTours];
      }

      // Lấy tour đã đặt
      const bookings = await getUserBookings(userId);
      const bookedIds = bookings.map(booking => booking.tour_id?._id);
      setBookedTourIds(bookedIds);

      // Sắp xếp tour đã đặt lên trước
      const sortedTours = [...tours].sort((a, b) => {
        const aBooked = bookedIds.includes(a._id);
        const bBooked = bookedIds.includes(b._id);
        return bBooked - aBooked;
      });

      // Gắn connector
      let newData = sortedTours.flatMap((tour, index) => {
        const isBooked = bookedIds.includes(tour._id);
        const item = {
          id: tour._id,
          name: tour.name,
          image: Array.isArray(tour.image) ? tour.image[0] : tour.image,
          isBooked,
          canBook: tour.price > 0
        };
        return index < sortedTours.length - 1
          ? [item, { connector: true }]
          : [item];
      });

      // Giới hạn ban đầu 3 tour (vẫn giữ connector)
      newData = limitToursWithConnectors(newData, 3);

      setData(newData);
      await saveScheduleToStorage(userId, newData);
    } catch (e) {
      console.error('Lỗi khi reset lịch trình:', e);
    } finally {
      setLoading(false);
    }
  };

  // Xoá item
  const handleRemovePlace = async (index) => {
    const item = data[index];
    if (item.isBooked) {
      Alert.alert('Thông báo', 'Không thể xóa tour đã đặt!');
      return;
    }

    const newData = [...data];
    if (index > 0 && newData[index - 1]?.connector) {
      newData.splice(index - 1, 2);
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

  // Di chuyển lên
  const moveItemUp = async (index) => {
    if (index <= 1) return;
    const newData = [...data];
    [newData[index - 2], newData[index]] = [newData[index], newData[index - 2]];
    setData(newData);
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      await saveScheduleToStorage(userId, newData);
    } catch (error) {
      console.error('Lỗi khi lưu lịch trình:', error);
    }
  };

  // Di chuyển xuống
  const moveItemDown = async (index) => {
    if (index >= data.length - 2) return;
    const newData = [...data];
    [newData[index], newData[index + 2]] = [newData[index + 2], newData[index]];
    setData(newData);
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      await saveScheduleToStorage(userId, newData);
    } catch (error) {
      console.error('Lỗi khi lưu lịch trình:', error);
    }
  };

  // Thêm tour
  const handleAddTour = async (newTour) => {
    const exists = data.some(item => item?.id === newTour._id);
    if (exists) return;

    const isBooked = bookedTourIds.includes(newTour._id);
    const newItem = {
      id: newTour._id,
      name: newTour.name,
      image: Array.isArray(newTour.image) ? newTour.image[0] : newTour.image,
      isBooked,
      isAdded: true,
      canBook: newTour.price > 0
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

  // Gọi API hoặc load dữ liệu đã lưu
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!cateID) return;
        setLoading(true);
        try {
          const userId = await AsyncStorage.getItem('USER_ID');
          if (!userId) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
            setLoading(false);
            return;
          }

          // Thử load lịch trình đã lưu
          const savedSchedule = await loadSavedSchedule();
          if (savedSchedule && savedSchedule.length > 0) {
            // Kiểm tra số lượng tour (item có name)
            const tourCount = savedSchedule.filter(item => item.name).length;
            if (tourCount === 1) {
              // Nếu chỉ còn 1 tour, reset lịch trình
              await resetSchedule(userId);
            } else {
              setData(savedSchedule);
              setLoading(false);
            }
            return;
          }

          // Nếu không có lịch trình lưu, load từ API
          let res = await getToursByLocation(cateID);
          let tours = res.data || res;
          tours = tours.filter(t => t.name && t.image && t.image.length > 0);

          // Nếu chỉ có 1 tour, random thêm từ cùng danh mục (ALL)
          if (tours.length === 1) {
            const resAll = await getAllToursByLocation(cateID);
            const allTours = (resAll.data || resAll).filter(
              t => t.name && t.image && t.image.length > 0
            );
            const extraTours = allTours
              .filter(t => t._id !== tours[0]._id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
            tours = [...tours, ...extraTours];
          }

          // Lấy tour đã đặt
          const bookings = await getUserBookings(userId);
          const bookedIds = bookings.map(booking => booking.tour_id?._id);
          setBookedTourIds(bookedIds);

          // Sắp xếp tour đã đặt lên trước
          const sortedTours = [...tours].sort((a, b) => {
            const aBooked = bookedIds.includes(a._id);
            const bBooked = bookedIds.includes(b._id);
            return bBooked - aBooked;
          });

          // Gắn connector
          let newData = sortedTours.flatMap((tour, index) => {
            const isBooked = bookedIds.includes(tour._id);
            const item = {
              id: tour._id,
              name: tour.name,
              image: Array.isArray(tour.image) ? tour.image[0] : tour.image,
              isBooked,
              canBook: tour.price > 0
            };
            return index < sortedTours.length - 1
              ? [item, { connector: true }]
              : [item];
          });

          // Giới hạn ban đầu 3 tour (vẫn giữ connector)
          newData = limitToursWithConnectors(newData, 3);
          setData(newData);

          // Lưu lại lịch trình mới vào AsyncStorage
          await saveScheduleToStorage(userId, newData);
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
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (!item || !item.name) return null;
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
        cateID={cateID}
        existingTourIds={data.filter(item => item?.id).map(t => t.id)}
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
});