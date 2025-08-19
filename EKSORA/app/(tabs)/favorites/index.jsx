import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Body from "../../../components/favorites/Component/body";
import Header from "../../../components/favorites/Component/header";
import { useBackToHome } from "../../../hooks/useBackToHome";

export default function FavoritesScreen() {
  useBackToHome("favorites");

  const [filterData, setFilterData] = useState({
    selectedDestination: null,
    selectedCategory: null,
    selectedTime: null,
  });

  return (
    <View style={styles.container}>
      <Header setFilterData={setFilterData} />
      <Body filterData={filterData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fafd",
  },
});
