import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

const DanhMucTab = () => {
  const tabs = ['Vé tham quan', 'Di chuyển', 'Thêm nhiều khám phá'];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12 }}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} style={{ backgroundColor: '#E3F2FD', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 }}>
          <Text style={{ color: '#0D47A1', fontSize: 14 }}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DanhMucTab;
