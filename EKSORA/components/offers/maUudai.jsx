import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const khuyenMaiList = [
  { title: 'Với Thẻ SIM', subtitle: 'Giảm 10%', note: 'Đơn tối thiểu 500.000đ', action: 'Lưu mã' },
  { title: 'Với Thẻ SIM', subtitle: 'Giảm 10%', note: 'Đơn tối thiểu 1.000.000đ', action: 'Lưu mã' },
  { title: 'Săn điểm check-in', subtitle: 'VNĐ 799.000đ', note: 'Không áp dụng cùng mã khác', action: 'Sử dụng' },
];

const MaUuDai = () => (
  <View style={{ backgroundColor: 'white', padding: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0D47A1' }}>Mã ưu đãi</Text>
      <Text style={{ color: '#2196F3' }}>Xem tất cả</Text>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {khuyenMaiList.map((item, idx) => (
        <View key={idx} style={{ width: '30%', backgroundColor: '#E3F2FD', borderRadius: 10, padding: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{item.title}</Text>
          <Text style={{ fontSize: 12, marginTop: 4 }}>{item.subtitle}</Text>
          <Text style={{ fontSize: 10, color: 'gray' }}>{item.note}</Text>
          <TouchableOpacity style={{ marginTop: 8, backgroundColor: 'white', paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 12, color: '#0D47A1' }}>{item.action}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

export default MaUuDai;
