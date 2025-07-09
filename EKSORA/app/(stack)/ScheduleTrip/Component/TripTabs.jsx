import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const tabs = ['Vé Tham Quan', 'Di chuyển', 'Khác'];

export default function TripTabs() {
  const [activeTab, setActiveTab] = useState('Vé Tham Quan');

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={styles.tabButton}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}
          >
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: '600',
  },
  underline: {
    marginTop: 6,
    height: 2,
    width: 40,
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
});
