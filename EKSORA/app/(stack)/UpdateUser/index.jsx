import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { routeToScreen } from 'expo-router/build/useScreens';
import { router } from 'expo-router';

export default function PersonalInfoScreen() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    title: '',
    birth: '',
    country: '',
    phoneEmail: ''
  });

  const handleChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleSave = () => {
    console.log('Thông tin lưu:', userInfo);
    // Gửi API lưu thông tin ở đây nếu cần
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black"  onPress={() => router.push('/(tabs)/account')}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <Ionicons name="eye-off-outline" size={24} color="black" />
      </View>

      {/* Body */}
      <ScrollView style={styles.body}>
        <Item label="Ảnh của tôi" valueComponent={<Avatar />} />
        <Item label="Tên của bạn" inputValue={userInfo.name} onChangeText={(text) => handleChange('name', text)} />
        <Item label="Danh xưng" inputValue={userInfo.title} onChangeText={(text) => handleChange('title', text)} />
        <Item label="Ngày sinh" inputValue={userInfo.birth} onChangeText={(text) => handleChange('birth', text)} />
        <Item label="Quốc gia/Khu vực cư trú" inputValue={userInfo.country} onChangeText={(text) => handleChange('country', text)} />
        <Item label="Số điện thoại/Email" inputValue={userInfo.phoneEmail} onChangeText={(text) => handleChange('phoneEmail', text)} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Item({ label, value, valueComponent, inputValue, onChangeText, noValue }) {
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemLabel}>{label}</Text>
          {!valueComponent && inputValue !== undefined && <Text style={styles.editText}>Chỉnh sửa</Text>}
        </View>
        {valueComponent ? (
          valueComponent
        ) : inputValue !== undefined ? (
          <TextInput
            style={styles.inputField}
            value={inputValue}
            onChangeText={onChangeText}
            placeholder="Chưa có"
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={[styles.valueText, noValue && { color: '#666', fontSize: 12 }]}>{value}</Text>
        )}
      </View>
    </View>
  );
}

function Avatar() {
  return (
    <View style={styles.avatarWrapper}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  body: {
    paddingHorizontal: 16,
  },
  itemWrapper: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 0,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 14,
    color: '#000',
  },
  editText: {
    color: '#007BFF',
    fontSize: 13,
  },
  valueText: {
    fontSize: 14,
    color: '#000',
  },
  inputField: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#000',
  },
  avatarWrapper: {
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 250,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
