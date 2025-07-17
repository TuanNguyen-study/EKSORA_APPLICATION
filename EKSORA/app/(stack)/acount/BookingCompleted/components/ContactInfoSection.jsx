import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../../../constants/colors';


const ContactForm = ({ contactInfo, onInputChange, onConfirm }) => (
  <View style={styles.formContainer}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Họ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nguyễn Văn"
        value={contactInfo.lastName}
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => onInputChange("lastName", text)}
      />
    </View>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Tên</Text>
      <TextInput
        style={styles.input}
        placeholder="An"
        placeholderTextColor="#A9A9A9"
        value={contactInfo.firstName}
        onChangeText={(text) => onInputChange("firstName", text)}
      />
    </View>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        placeholder="09xxxxxxxx"
        keyboardType="phone-pad"
        placeholderTextColor="#A9A9A9"
        value={contactInfo.phone}
        onChangeText={(text) => onInputChange("phone", text)}
      />
    </View>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
        value={contactInfo.email}
        onChangeText={(text) => onInputChange("email", text)}
      />
    </View>
    <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
      <Text style={styles.confirmButtonText}>Xác nhận</Text>
    </TouchableOpacity>
  </View>
);

const UserInfoDisplay = ({ user, onEdit }) => (
  <View style={styles.userInfoContainer}>
    <View style={styles.userInfoRow}>
      <Text style={styles.userInfoLabel}>Họ và Tên</Text>
      <Text style={styles.userInfoValue}>{`${user?.lastName || ''} ${user?.firstName || ''}`}</Text>
    </View>
    <View style={styles.userInfoRow}>
      <Text style={styles.userInfoLabel}>Số điện thoại</Text>
      <Text style={styles.userInfoValue}>{user?.phone || 'Chưa cung cấp'}</Text>
    </View>
    <View style={styles.userInfoRow}>
      <Text style={styles.userInfoLabel}>Email</Text>
      <Text style={styles.userInfoValue}>{user?.email || 'Chưa cung cấp'}</Text>
    </View>
    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
      <Ionicons name="pencil" size={16} color={COLORS.primary} />
      <Text style={styles.editText}>Chỉnh sửa</Text>
    </TouchableOpacity>
  </View>
);


// -- COMPONENT CHÍNH --

const ContactInfoSection = ({
  isUsingSavedInfo,
  setIsUsingSavedInfo,
  contactToDisplay,
  formInfo,
  handleFormInputChange,
  handleConfirmNewContact,
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Thông tin liên lạc</Text>
    
    <View style={styles.segmentControl}>
      <TouchableOpacity
        style={[styles.segmentButton, isUsingSavedInfo && styles.segmentButtonActive]}
        onPress={() => setIsUsingSavedInfo(true)}>
        <Text style={[styles.segmentText, isUsingSavedInfo && styles.segmentTextActive]}>Thông tin của tôi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.segmentButton, !isUsingSavedInfo && styles.segmentButtonActive]}
        onPress={() => setIsUsingSavedInfo(false)}>
        <Text style={[styles.segmentText, !isUsingSavedInfo && styles.segmentTextActive]}>Dùng thông tin khác</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.content}>
      {isUsingSavedInfo ? (
        <UserInfoDisplay user={contactToDisplay} onEdit={() => setIsUsingSavedInfo(false)} />
      ) : (
        <ContactForm
          contactInfo={formInfo}
          onInputChange={handleFormInputChange}
          onConfirm={handleConfirmNewContact}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
  },
  content: {
    marginTop: 20,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: '#F4F5F7', 
    borderRadius: 50,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
  },
  segmentTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    paddingHorizontal: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
  },
  userInfoLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  userInfoValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '600',
    maxWidth: '60%', 
    textAlign: 'right',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 16,
  },
  editText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },

  formContainer: {
    paddingHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    color: COLORS.black,
    fontWeight: '500', 
    borderWidth: 1,
    borderColor: '#EAECEE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    backgroundColor: '#FDFEFE',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ContactInfoSection;