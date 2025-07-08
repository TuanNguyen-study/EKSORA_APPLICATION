import { router } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ItineraryList({ data, tourImages }) {
  console.log(">>> ItineraryList nhận được tourImages:", tourImages);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch trình</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Tất cả</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item}) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/(stack)/ScheduleDetail',
              params: {
               tourImages: JSON.stringify(tourImages),
                day: item.day,
              },
            })} >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.dayLabel}>
                <Text style={styles.dayLabelText}>{item.day}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardDetail}>
                  {item.places} địa điểm, {item.distance} km
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
        }
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  viewAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  list: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 110,
  },
  dayLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 10,
  },
  dayLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardInfo: {
    padding: 8,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  cardDetail: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
