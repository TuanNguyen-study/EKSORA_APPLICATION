import { StyleSheet, View } from 'react-native';
import React from 'react';
import Header from '../../../components/offers/header';
import Offer from '../../../components/offers/Offer';
import Promotions from '../../../components/offers/Promotion';

const IndexScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header />
      <Offer />
      <Promotions />
    </View>
  );
};

export default IndexScreen;
