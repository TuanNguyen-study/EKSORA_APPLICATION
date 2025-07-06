import React from 'react';
import { View, FlatList, Text, StyleSheet, ScrollView } from 'react-native';
import ScheduleHeader from '../ScheduleDetail/Components/ScheduleHeader';
import PlaceItem from '../ScheduleDetail/Components/PlaceItem';
import TimelineConnector from '../ScheduleDetail/Components/TimelineConnector';
import AddButton from '../ScheduleDetail/Components/AddButton';




const DATA = [
  {
    id: '1',
    name: 'Chuồn Chuồn Bistro',
    image: 'https://flytime.vn/upload/img/products/08ae65742cda01e85a345a92e2744a2b.gif',
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
    name: 'Dinh Cậu',
    image: 'https://vcdn1-dulich.vnecdn.net/2019/10/19/Dinh-Cau-Phu-Quoc-Vnexpress4-1571446732.jpg?w=460&h=0&q=100&dpr=1&fit=crop&s=89c06rbop1sOS62F6OnwKQ',
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
    name: 'Nhà tù Phú Quốc',
    image: 'https://vcdn1-vnexpress.vnecdn.net/2022/11/30/416f88e323c1fa9fa3d0-1-1669800-3541-2862-1669800156.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=6iihkwxra2nFKS5X_9e1oA',
    visitDuration: '30p',
    startTime: '11:00',
  },
];


const index = () => {
  return (
    <View style={styles.container}>
      <ScheduleHeader />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Ngày Tham Quan • 09/07/2025 • 68.5 km • 6 địa điểm</Text>
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
}

export default index

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