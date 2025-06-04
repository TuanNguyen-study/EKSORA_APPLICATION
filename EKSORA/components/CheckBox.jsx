import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CheckBox = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onChange(!checked)}>
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={20}
        color={checked ? '#007AFF' : '#999'}
      />
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default CheckBox;
