import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function TripInfoSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bao gồm</Text>
      <View style={styles.row}>
        <Entypo name="ticket" size={18} color="#000" style={styles.icon}  />
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Chuyến đi </Text>
          <Text style={styles.infoSub}>1 vé tham quan</Text>
        </View>
      </View>


      <View style={styles.memberHeader}>
        <Text style={styles.sectionTitle}>Thành viên</Text>
        <View style={styles.memberIcons}>
          <FontAwesome name="users" size={18} color="#007AFF" style={styles.iconRight} />
          <MaterialIcons name="chat-bubble-outline" size={18} color="#FF3B5C" style={styles.iconRight} />
        </View>
      </View>

      <View style={styles.row}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
          style={styles.avatar}
        />
        <View style={styles.infoText}>
          <Text style={styles.memberName}>Võ Minh</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSub: {
    fontSize: 13,
    color: '#555',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
