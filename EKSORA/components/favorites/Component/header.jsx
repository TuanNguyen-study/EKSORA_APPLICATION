import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // hoặc react-native-vector-icons

export default function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Yêu thích</Text>
            <View style={styles.icons}>
                <Ionicons name="create-outline" size={20} style={styles.icon} />
                <Ionicons name="settings-outline" size={20} />
            </View>

            <View style={styles.filterRow}>
                <TouchableOpacity style={styles.filterBtn}><Text>Tây Ninh</Text></TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}><Text>Đà Lạt</Text></TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}><Text>Vé tham quan</Text></TouchableOpacity>
                <Ionicons name="options-outline" size={20} style={styles.filterIcon} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 16,
        backgroundColor: '#e0f0ff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#005c8b',
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -30,
    },
    icon: {
        marginRight: 16,
    },
    filterRow: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    filterBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 8,
    },
    filterIcon: {
        marginLeft: 'auto',
    },
});
