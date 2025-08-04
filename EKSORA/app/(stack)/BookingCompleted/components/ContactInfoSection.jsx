import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../../../constants/colors';

import {
    formatEmail,
    formatName,
    formatPhoneNumber,
    validateEmail,
    validateName,
    validatePhoneNumber,
} from '../../../../utils/validators'; 

const ContactForm = ({ contactInfo, onInputChange, onConfirm, loading, errors }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.formContainer}
  >
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* --- Ô NHẬP HỌ --- */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Họ</Text>
        <TextInput
          style={[styles.input, errors.lastName && styles.inputError]}
          placeholder="Nguyễn Văn"
          value={contactInfo.lastName}
          placeholderTextColor="#A9A9A9"
          onChangeText={(text) => onInputChange('lastName', text)}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
      </View>

      {/* --- Ô NHẬP TÊN --- */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={[styles.input, errors.firstName && styles.inputError]}
          placeholder="An"
          value={contactInfo.firstName}
          placeholderTextColor="#A9A9A9"
          onChangeText={(text) => onInputChange('firstName', text)}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
      </View>

      {/* --- Ô NHẬP SỐ ĐIỆN THOẠI --- */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="09xxxxxxxx"
          keyboardType="phone-pad"
          value={contactInfo.phone}
          placeholderTextColor="#A9A9A9"
          onChangeText={(text) => onInputChange('phone', text)}
          maxLength={10} 
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      {/* --- Ô NHẬP EMAIL --- */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={contactInfo.email}
          placeholderTextColor="#A9A9A9"
          onChangeText={(text) => onInputChange('email', text)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={onConfirm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
);

const UserInfoDisplay = ({ user, onEdit }) => (
  <View style={styles.userInfoContainer}>
    <View style={styles.userInfoRow}>
      <Text style={styles.userInfoLabel}>Họ và Tên</Text>
      <Text style={styles.userInfoValue} numberOfLines={1}>{`${user?.lastName || ''} ${user?.firstName || ''}`.trim()}</Text>
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

const ContactInfoSection = ({
  isUsingSavedInfo,
  setIsUsingSavedInfo,
  contactToDisplay,
  formInfo,
  setFormInfo,
  handleConfirmNewContact, // Hàm xử lý khi form hợp lệ và được xác nhận
  handleEditContact,
  loading,
}) => {
  // State để quản lý và hiển thị lỗi trên form
  const [formErrors, setFormErrors] = useState({
    lastName: null,
    firstName: null,
    phone: null,
    email: null,
  });

  // Hàm xóa tất cả các lỗi hiện có
  const resetErrors = () => {
    setFormErrors({ lastName: null, firstName: null, phone: null, email: null });
  };

  // Hàm xử lý thay đổi input, kết hợp định dạng và kiểm tra lỗi tức thì
  const handleInputChange = (field, value) => {
    let formattedValue = value;
    let error = null;

    // Định dạng và kiểm tra lỗi dựa trên loại trường (field)
    switch (field) {
      case 'lastName':
        formattedValue = formatName(value);
        error = validateName(formattedValue, 'Họ');
        break;
      case 'firstName':
        formattedValue = formatName(value);
        error = validateName(formattedValue, 'Tên');
        break;
      case 'phone':
        formattedValue = formatPhoneNumber(value);
        error = validatePhoneNumber(formattedValue);
        break;
      case 'email':
        formattedValue = formatEmail(value);
        error = validateEmail(formattedValue);
        break;
      default:
        break;
    }

    // Cập nhật giá trị đã định dạng vào state của form
    setFormInfo((prevInfo) => ({
      ...prevInfo,
      [field]: formattedValue,
    }));

    // Cập nhật lỗi (nếu có) vào state lỗi
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  // Hàm kiểm tra toàn bộ form trước khi gửi đi
  const validateAndConfirm = () => {
    const lastNameError = validateName(formInfo.lastName, 'Họ');
    const firstNameError = validateName(formInfo.firstName, 'Tên');
    const phoneError = validatePhoneNumber(formInfo.phone);
    const emailError = validateEmail(formInfo.email);

    // Nếu có bất kỳ lỗi nào, hiển thị tất cả lỗi và dừng lại
    if (lastNameError || firstNameError || phoneError || emailError) {
      setFormErrors({
        lastName: lastNameError,
        firstName: firstNameError,
        phone: phoneError,
        email: emailError,
      });
      return;
    }

    // Nếu không có lỗi, gọi hàm xác nhận từ component cha
    handleConfirmNewContact(formInfo);
  };

  // Xử lý khi người dùng chọn tab "Thông tin của tôi"
  const handleUseMyInfo = () => {
    setIsUsingSavedInfo(true);
    resetErrors(); 
  };

  // Xử lý khi người dùng chọn tab "Dùng thông tin khác"
  const handleUseOtherInfo = () => {
    setIsUsingSavedInfo(false);
    resetErrors();

  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Thông tin liên lạc</Text>

      <View style={styles.segmentControl}>
        <TouchableOpacity
          style={[styles.segmentButton, isUsingSavedInfo && styles.segmentButtonActive]}
          onPress={handleUseMyInfo}
        >
          <Text style={[styles.segmentText, isUsingSavedInfo && styles.segmentTextActive]}>
            Thông tin của tôi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, !isUsingSavedInfo && styles.segmentButtonActive]}
          onPress={handleUseOtherInfo}
        >
          <Text style={[styles.segmentText, !isUsingSavedInfo && styles.segmentTextActive]}>
            Dùng thông tin khác
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isUsingSavedInfo ? (
          <UserInfoDisplay user={contactToDisplay} onEdit={handleEditContact} />
        ) : (
          <ContactForm
            contactInfo={formInfo}
            onInputChange={handleInputChange} 
            onConfirm={validateAndConfirm}    
            loading={loading}
            errors={formErrors}              
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    shadowColor: '#000',
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
    flex: 1,
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
  inputError: {
    borderColor: COLORS.red, 
  },
  errorText: {
    color: COLORS.red, 
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
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