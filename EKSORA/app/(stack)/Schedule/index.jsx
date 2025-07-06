import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { COLORS } from "../../../constants/colors";


const { width } = Dimensions.get('window');

export default function LenLichTrinhScreen() {
  const [isPublic, setIsPublic] = useState(true);
  const [startDate, setStartDate] = useState(new Date(2025, 6, 8));
  const [endDate, setEndDate] = useState(new Date(2025, 6, 10));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date) => date.toLocaleDateString('vi-VN');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lên lịch trình</Text>

      {/* Card chứa toàn bộ thông tin */}
      <View style={styles.card}>
        {/* Điểm xuất phát */}
        <TouchableOpacity style={styles.row}>
          <Ionicons name="navigate-circle-outline" size={22} color="#555" style={styles.icon} />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Điểm xuất phát</Text>
            <Text style={styles.value}>Hồ Chí Minh</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Ngày khởi hành và về */}
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={22} color="#555" style={styles.icon} />
          <View style={styles.dateRow}>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.label}>Khởi hành</Text>
              <Text style={styles.value}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowEndPicker(true)}>
              <Text style={styles.label}>Ngày về</Text>
              <Text style={styles.value}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Số người */}
        <TouchableOpacity style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#555" style={styles.icon} />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Số người</Text>
            <Text style={styles.value}>1 người lớn</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Công khai */}
        <View style={styles.row}>
          <Ionicons name="lock-open-outline" size={22} color="#555" style={styles.icon} />
          <View style={styles.rowContentBetween}>
            <Text style={styles.label}>Công khai</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              thumbColor={isPublic ? COLORS.background : '#ccc'}
              trackColor={{ false: '#ccc', true: '#FF99AA' }}
            />
          </View>
        </View>
      </View>

      {/* Nút bấm */}
      <TouchableOpacity style={styles.button} onPress={ () => router.push('/(stack)/ScheduleTrip')}>
        <Text style={styles.buttonText}>Lên lịch trình</Text>
      </TouchableOpacity>

      {/* Date pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 30,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 24,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  rowContent: {
    marginLeft: 12,
    flex: 1,
  },
  rowContentBetween: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  dateBox: {
    flex: 1,
    marginRight: 12,
  },
  icon: {
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
