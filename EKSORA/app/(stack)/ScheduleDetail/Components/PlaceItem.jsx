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
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PlaceItem({ item, onRemove, onMoveUp, onMoveDown, disableUp, disableDown }) {
  const { time, close } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.horizontal}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
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

          {/* Góc dưới: Đặt ngay + nút di chuyển */}
          <View style={styles.bottomActions}>
            <View style={{ minWidth: 60 }}>
              {item.isBooked ? (
                <Text style={styles.bookedText}>Đã đặt</Text>
              ) : item.canBook ? (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(stack)/trip-detail/[id]',
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={[styles.bookNowText, item.isAdded && { opacity: 0 }]}>
                    Đặt ngay
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Nút di chuyển item */}
            <View style={styles.moveContainer}>
              <TouchableOpacity onPress={onMoveUp} disabled={disableUp} style={styles.moveButton}>
                <AntDesign name="arrowup" size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onMoveDown} disabled={disableDown} style={styles.moveButton}>
                <AntDesign name="arrowdown" size={15} />
              </TouchableOpacity>
            </View>
          </View>

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
    borderRadius: 12,
    margin: 8,
  },
  info: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  bookedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  bookNowText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 12,
    alignItems: 'center',
  },
  moveContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  moveButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
});
