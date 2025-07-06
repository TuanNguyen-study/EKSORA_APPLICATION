import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function NotificationScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <TouchableOpacity onPress={() => router.push('/MyOrder/HelpScreen')}>
                <Ionicons name="help-circle-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Alert box */}
            <View style={styles.alertBox}>
                <Ionicons name="notifications-outline" size={18} color="#007AFF" />
                <Text style={styles.alertText}>
                    Bạn có muốn ưu tiên nhận thông báo về các cập nhật quan trọng?
                </Text>
                <TouchableOpacity>
                    <Text style={styles.allowText}>Cho phép thông báo</Text>
                </TouchableOpacity>
            </View>

            {/* No notification section */}
            <View style={styles.noNotification}>
                <Image
                    source={require('../../../assets/images/notification.png')} // Thay ảnh ở đây bằng ảnh tương ứng của bạn
                    style={styles.image}
                />
                <Text style={styles.noText}>Không có thông báo</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    header: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    alertBox: {
        margin: 16,
        backgroundColor: '#F2F7FF',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    alertText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    allowText: {
        marginTop: 6,
        color: '#007AFF',
        fontWeight: '600',
    },
    noNotification: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 12,
    },
    noText: {
        fontSize: 14,
        color: '#666',
    },
});
