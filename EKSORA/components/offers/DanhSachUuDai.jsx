import React from 'react';
import { View, Text, Image, FlatList, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

const data = new Array(4).fill({
  title: 'Combo Khách Sạn 4 Sao + Vé Máy Bay Đà Nẵng Hội An - 4 Ngày 3 Đêm',
  price: '2,250,000',
  discount: '15%',
  image: require('../../assets/images/uudai.png'), // thay bằng ảnh thật
});

const DanhSachUuDai = () => {
  return (
    <View style={{ backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#0D47A1', marginBottom: 12 }}>Ưu đãi đang diễn ra</Text>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', marginBottom: 16, width: (width - 48) / 2, borderRadius: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 }}>
            <Image source={item.image} style={{ height: 100, width: '100%' }} resizeMode="cover" />
            <View style={{ padding: 8 }}>
              <Text style={{ fontSize: 12 }}>{item.title}</Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#D32F2F', marginTop: 4 }}>Từ ₫{item.price}</Text>
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#D32F2F', borderRadius: 4 }}>
                <Text style={{ color: 'white', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2 }}>Giảm {item.discount}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default DanhSachUuDai;
