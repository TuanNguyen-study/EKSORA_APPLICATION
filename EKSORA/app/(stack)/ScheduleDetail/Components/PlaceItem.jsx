import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
export default function PlaceItem({ item, onRemove}) {
  const {time, close} = useLocalSearchParams();
  return (
    <View style={styles.card}>
      <View style={styles.horizontal}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity onPress={onRemove}>
              <Ionicons name="close" size={20} color="gray" />
            </TouchableOpacity>
          </View>
          <Text style={styles.visitTime}>
             Thời gian mở cửa:  
            <Text style={styles.time}> {time}</Text>
          </Text>
           <Text style={styles.visitTime}>
             Thời gian đóng cửa:  
            <Text style={styles.time}> {close}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: '',
  },
  name: {
    fontSize: width < 360 ? 14 : 16,
    fontWeight: '600',
    flexShrink: 1,
    paddingRight: 8,
  },
  visitTime: {
    marginTop: 4,
    color: 'gray',
    fontSize: width < 360 ? 12 : 14,
  },
  time: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
