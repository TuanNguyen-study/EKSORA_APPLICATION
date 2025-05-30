// app/(stack)/trip-detail/components/PolicyInfoSection.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const PolicyItem = ({ title, content, isOpen, onPress }) => {
  return (
    <View style={styles.policyItemContainer}>
      <TouchableOpacity onPress={onPress} style={styles.policyHeader}>
        <Ionicons name="document-text-outline" size={20} color={COLORS.primary} style={{marginRight: 8}}/>
        <Text style={styles.policyTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={22}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.policyContentContainer}>
          <Text style={styles.policyContent}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const PolicyInfoSection = ({ title, policies }) => {
  const [openPolicyId, setOpenPolicyId] = useState(null); // Chỉ cho mở 1 policy một lúc

  if (!policies || policies.length === 0) {
    return null;
  }

  const togglePolicy = (policyId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenPolicyId(openPolicyId === policyId ? null : policyId);
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {policies.map((policy) => (
        <PolicyItem
          key={policy.id}
          title={policy.title}
          content={policy.content}
          isOpen={openPolicyId === policy.id}
          onPress={() => togglePolicy(policy.id)}
        />
      ))}
       <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreButtonText}>Đọc kỹ Chính sách & Điều khoản</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  policyItemContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden', // Quan trọng cho LayoutAnimation
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    // backgroundColor: COLORS.primaryUltraLight,
  },
  policyTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  policyContentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 15,
    paddingTop: 5, // Khoảng cách nhỏ từ header xuống content
  },
  policyContent: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  readMoreButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  readMoreButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  }
});

export default PolicyInfoSection;