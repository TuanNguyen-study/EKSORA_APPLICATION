import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Body from "../../../components/favorites/Component/body";
import Header from "../../../components/favorites/Component/header";

export default function FavoritesScreen() {
  const [filterData, setFilterData] = useState({
    selectedDestination: null,
    selectedCategory: null,
    selectedTime: null,
  });

  return (
    <View style={styles.container}>
      <ScrollView>
       
        <Header setFilterData={setFilterData} />
        <Body filterData={filterData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fafd",
  },
 
});
