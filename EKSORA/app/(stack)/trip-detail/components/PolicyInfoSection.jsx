import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors'; 

const PolicyInfoSection = ({ noteTitle, notes, contactInfo, onChatPress }) => {


  const renderNoteItem = (note, index) => {
    // Nếu note là một chuỗi đơn giản
    if (typeof note === 'string') {
      if (note.startsWith('#')) { 
        return <Text key={`note_title_${index}`} style={styles.subHeaderText}>{note.substring(1).trim()}</Text>;
      }
      if (note.startsWith('•') || note.startsWith('-') || note.startsWith('*')) { 
        return <Text key={`note_bullet_${index}`} style={styles.bulletPointText}>{note}</Text>;
      }
      return <Text key={`note_text_${index}`} style={styles.contentText}>{note}</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Section Những điều cần lưu ý */}
      {notes && notes.length > 0 && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerIndicator} />
            <Text style={styles.sectionTitle}>{noteTitle || "Những điều cần lưu ý"}</Text>
          </View>
          <View style={styles.notesContentContainer}>
            {notes.map(renderNoteItem)}
          </View>
        </View>
      )}

      {/* Section Liên hệ với chúng tôi */}
      {contactInfo && (
        <View style={[styles.sectionBlock, (notes && notes.length > 0) && styles.marginTopRegular]}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerIndicator} />
            <Text style={styles.sectionTitle}>{contactInfo.title || "Liên hệ với chúng tôi"}</Text>
          </View>
          <Text style={styles.contactDescriptionText}>{contactInfo.description}</Text>
          <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} style={styles.chatButtonIcon} />
            <Text style={styles.chatButtonText}>{contactInfo.buttonText || "Chat với chúng tôi"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionBlock: {
    marginBottom: 24, 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIndicator: {
    width: 6,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  // Notes Section
  notesContentContainer: {
    paddingLeft: 16, 
  },
  subHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  bulletPointText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 6,
    paddingLeft: 0, 
  },
  // Contact Section
  contactDescriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 16,
    paddingLeft: 16, 
  },
  chatButton: {
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
    marginLeft: 16, 
  },
  chatButtonIcon: {
    marginRight: 8,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
  },
  marginTopRegular: {
      marginTop: 20, 
  }
});

export default PolicyInfoSection;