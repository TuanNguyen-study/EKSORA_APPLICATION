import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useRouter } from 'expo-router';

const HeaderSearchBar = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => router.push('/(stack)/search')}>

        <Ionicons name="search" size={20} color={COLORS.black} style={styles.searchIcon} />
        <TextInput
          placeholder="Search something..."
          placeholderTextColor={COLORS.black || '#A0DFFF'}
          style={styles.searchInput}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => router.push('/(stack)/ShoppingCartScreen')}>
        <Ionicons name="cart-outline" size={26} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(stack)/notification')}>
        <Ionicons name="notifications-outline" size={26} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    //paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 42,
    borderWidth: 0.5,
    borderColor: COLORS.black,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.black,
    fontSize: 15,
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
});

export default HeaderSearchBar;