import React from 'react';
import { View, FlatList } from 'react-native';
import { tours } from '../Component/tours'
import FavoriteItem from '../FavoriteItem'

export default function Body() {
  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={tours}
        renderItem={({ item }) => <FavoriteItem {...item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
