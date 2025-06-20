import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function hearderPhone() {
    return (
        <View>
            <Text style={styles.title}>Đăng ký</Text>
        </View>
    )
}


const styles = StyleSheet.create({

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
    },
})