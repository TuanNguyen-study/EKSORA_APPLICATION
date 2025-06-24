import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { getUserProfile, updateUserProfile } from '../../../API/services/servicesProfile';
import { provinces } from './provinces';



import DateTimePicker from '@react-native-community/datetimepicker';

const screenHeight = Dimensions.get('window').height;

export default function PersonalInfoScreen() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    title: '',
    birth: '',
    country: '',
    phoneEmail: '',
  });

  const [avatarUri, setAvatarUri] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const localAvatar = await AsyncStorage.getItem('LOCAL_AVATAR_URI');
        const localBirth = await AsyncStorage.getItem('LOCAL_BIRTH');
        if (localAvatar) setAvatarUri(localAvatar);

        const token = await AsyncStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          console.warn('Không tìm thấy token');
          return;
        }

        const user = await getUserProfile(token);
        setUserInfo({
          name: user.first_name || '',
          title: user.last_name || '',
          birth: localBirth || '',
          country: user.address || '',
          phoneEmail: user.phone || user.email || '',
        });
      } catch (err) {
        console.log('Lỗi khi tải dữ liệu người dùng:', err);
      }
    };

    loadData();
  }, []);

  const handleOpenModal = (field, currentValue) => {
    if (field === 'birth') {
      setShowDatePicker(true);
    } else {
      setCurrentField(field);
      setTempValue(currentValue);
      setModalVisible(true);
    }
  };

  const handleModalSave = async () => {
    try {
      const updatedField = { ...userInfo, [currentField]: tempValue };
      setUserInfo(updatedField);

      if (currentField === 'birth') {
        await AsyncStorage.setItem('LOCAL_BIRTH', tempValue);
      }

      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      if (!token) {
        alert('Không tìm thấy token!');
        return;
      }

      // Chuẩn bị payload
      const payload = {};
      switch (currentField) {
        case 'name':
          payload.first_name = tempValue;
          break;
        case 'title':
          payload.last_name = tempValue;
          break;
        case 'country':
          payload.address = tempValue;
          break;
        case 'phoneEmail':
          if (tempValue.includes('@')) {
          } else {
            payload.phone = tempValue;
          }
          break;
        default:
          break;
      }

      // Gọi API cập nhật nếu có trường hợp cần gửi
      if (Object.keys(payload).length > 0) {
        await updateUserProfile(token, payload);
      }

      setModalVisible(false);
      alert('Cập nhật thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd
      setUserInfo(prev => ({
        ...prev,
        birth: formattedDate,
      }));
      AsyncStorage.setItem('LOCAL_BIRTH', formattedDate);
    }
  };


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Bạn cần cấp quyền truy cập ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const base64Img = result.assets[0].base64;
      const uri = `data:image/jpeg;base64,${base64Img}`;

      setAvatarUri(uri); // hiển thị ảnh
      await AsyncStorage.setItem('LOCAL_AVATAR_URI', uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <Ionicons name="eye-off-outline" size={24} color="black" />
      </View>

      <ScrollView style={styles.body}>
        <Item label="Ảnh của tôi" valueComponent={<Avatar avatarUri={avatarUri} pickImage={pickImage} />} />

        <TouchableOpacity onPress={() => handleOpenModal('name', userInfo.name)}>
          <Item label="Tên của bạn" inputValue={userInfo.name} isEditable />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOpenModal('title', userInfo.title)}>
          <Item label="Danh xưng" inputValue={userInfo.title} isEditable />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOpenModal('birth', userInfo.birth)}>
          <Item label="Ngày sinh" inputValue={userInfo.birth} isEditable />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOpenModal('country', userInfo.country)}>
          <Item label="Quốc gia/Khu vực cư trú" inputValue={userInfo.country} isEditable />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOpenModal('phoneEmail', userInfo.phoneEmail)}>
          <Item label="Số điện thoại/Email" inputValue={userInfo.phoneEmail} isEditable />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity> */}
      </ScrollView>

      {/* Modal chỉnh sửa văn bản */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { height: currentField === 'country' ? screenHeight * 0.7 : screenHeight * 0.3 }
          ]}>
            <Text style={styles.modalTitle}>Chỉnh sửa {getFieldLabel(currentField)}</Text>

            {currentField === 'country' ? (
              <ScrollView >
                {provinces.map((province, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setTempValue(province)}
                    style={{
                      padding: 10,
                      backgroundColor: tempValue === province ? '#f0f0f0' : 'white',
                    }}
                  >
                    <Text>{province}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <TextInput
                style={styles.modalInput}
                placeholder={`Nhập ${getFieldLabel(currentField).toLowerCase()}`}
                value={tempValue}
                onChangeText={setTempValue}
              />
            )}

            <TouchableOpacity style={styles.modalSaveButton} onPress={handleModalSave}>
              <Text style={styles.modalSaveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker cho ngày sinh */}
      {showDatePicker && (
        <DateTimePicker
          value={userInfo.birth ? new Date(userInfo.birth) : new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

function Item({ label, inputValue, valueComponent, isEditable }) {
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemLabel}>{label}</Text>
          {isEditable && <Text style={styles.editText}>Chỉnh sửa</Text>}
        </View>
        {valueComponent ? (
          valueComponent
        ) : (
          <TextInput
            style={styles.inputField}
            value={inputValue}
            editable={false}
          />
        )}
      </View>
    </View>
  );
}

function Avatar({ avatarUri, pickImage }) {
  return (
    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
      <Image source={{ uri: avatarUri }} style={styles.avatar} />
    </TouchableOpacity>
  );
}

const getFieldLabel = (field) => {
  switch (field) {
    case 'name': return 'Tên của bạn';
    case 'title': return 'Danh xưng';
    case 'birth': return 'Ngày sinh';
    case 'country': return 'Quốc gia/Khu vực cư trú';
    case 'phoneEmail': return 'Số điện thoại/Email';
    default: return '';
  }
};

// STYLES
const styles = StyleSheet.create({
  // Container tổng thể
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    marginTop: 20,
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

  // Body ScrollView
  body: {
    paddingHorizontal: 16,
  },

  // Item thông tin
  itemWrapper: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
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
  inputField: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#000',
  },

  // Avatar
  avatarWrapper: {
    marginTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  // Nút Lưu
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

  // Modal chỉnh sửa văn bản
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //height: screenHeight * 0.3,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalSaveButton: {
    backgroundColor: '#FF5A00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
