import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceItem({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity>
            <Ionicons name="close" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Text style={styles.visitTime}>T/g tham quan: <Text style={styles.time}>{item.visitDuration}</Text></Text>

        <View style={styles.actions}>
          <TouchableOpacity>
            <Text style={styles.link}>📝 Ghi chú</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>📍 Gần đây</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timeLabel}>{item.startTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitTime: {
    marginTop: 4,
    color: 'gray',
  },
  time: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  link: {
    marginRight: 16,
    color: '#007BFF',
  },
  timeLabel: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
