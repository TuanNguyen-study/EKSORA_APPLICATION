import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from "../../../constants/colors";


const { width } = Dimensions.get('window');

export default function NotificationScreen() {
  const [selectedTab, setSelectedTab] = useState('chat');

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={() => router.push('/MyOrder/HelpScreen')}>
          <Ionicons name="help-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

 
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'chat' && styles.activeTab]}
          onPress={() => setSelectedTab('chat')}
        >
          <Text style={[styles.tabText, selectedTab === 'chat' && styles.activeTabText]}>
            Trò chuyện
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'update' && styles.activeTab]}
          onPress={() => setSelectedTab('update')}
        >
          <Text style={[styles.tabText, selectedTab === 'update' && styles.activeTabText]}>
            Cập nhật
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
   
        {selectedTab === 'update' && (
          <View style={styles.filterContainer}>
            {['Cập nhật đơn hàng', 'Ưu đãi', 'Lời nhắc'].map((label, index) => (
              <TouchableOpacity key={index} style={styles.filterButton}>
                <Text style={styles.filterText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      
        <View style={styles.noNotification}>
          <Image
            source={require('../../../assets/images/notification.png')}
            style={styles.image}
          />
          <Text style={styles.noText}>Không có thông báo</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gradientBackground,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryDark,
  },
  activeTabText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 13,
    color: '#333',
  },
  noNotification: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  noText: {
    fontSize: 14,
    color: '#666',
  },
});
