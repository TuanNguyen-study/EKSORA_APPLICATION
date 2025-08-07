import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet,Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../../constants/colors';

const NoteContactSection = () => {
  return (
    <View style={styles.noteContact_container}>
      {/* Những điều cần lưu ý */}
      <Text style={styles.noteContact_sectionTitle}>🔵 Những điều cần lưu ý</Text>
      <Text style={styles.noteContact_text}>• Limousine Bus: tối đa 17–22 người.</Text>
      <Text style={styles.noteContact_text}>• Sắp xếp hành lý cẩn thận, hạn chế hành lý cồng kềnh.</Text>
      <Text style={styles.noteContact_text}>• Thời gian khởi hành có thể thay đổi tùy tình hình.</Text>
      <Text style={styles.noteContact_text}>• Nếu có ưu đãi, vui lòng chọn ở phần Ưu đãi phía trên.</Text>

      {/* Liên hệ với chúng tôi */}
      <Text style={styles.noteContact_sectionTitle}>🔵 Liên hệ với chúng tôi</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Ionicons name="chatbox-ellipses-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
        <Text style={styles.noteContact_text}>Zalo: 0365.857.966 </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="chatbox-ellipses-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
        <Text style={styles.noteContact_text}>Messenger: EKSORA Travel</Text>
      </View>
      <TouchableOpacity
        style={styles.noteContact_button}
        onPress={() => Linking.openURL(`tel:0365857966`)}
      >
        <Ionicons
          name="chatbox-ellipses-outline"
          size={18}
          color={COLORS.primary}
          style={styles.noteContact_icon}
        />
        <Text style={styles.noteContact_buttonText}>Liên Hệ với chúng tôi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContact_container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  noteContact_sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  noteContact_text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  noteContact_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  noteContact_icon: {
    marginRight: 8,
  },
  noteContact_buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
  },
});

export default NoteContactSection;
