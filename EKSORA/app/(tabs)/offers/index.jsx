import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../../components/offers/header'
import Offer from '../../../components/offers/Offer'
import Promotions from '../../../components/offers/Promotion'


const index = () => {
  return (
    <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
      <Header />
      <Offer/>
      <Promotions/>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})