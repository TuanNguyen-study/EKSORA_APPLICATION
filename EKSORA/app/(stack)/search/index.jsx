import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import HeaderSearch from '../../../components/search/headerSearch';
import BodySearch from '../../../components/search/bodySearch';

const index = () => {
 return (
    <View style={styles.container}>
      <HeaderSearch />
        <BodySearch/>
    </View>
  );
};

export default index

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
  }
})