// ./components/ReviewFilterModal.js

import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics'; 
import { COLORS } from '../../../../constants/colors';

const ReviewFilterModal = ({ visible, onClose, onSelectFilter, activeFilter, reviews = [] }) => {
    const screenHeight = Dimensions.get('screen').height;
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    // Tính toán phân bố sao để hiển thị trong modal
    const distribution = useMemo(() => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (dist[rating] !== undefined) {
                dist[rating]++;
            }
        });
        return dist;
    }, [reviews]);

    const totalReviews = reviews.length;

    const filterOptions = [
        { label: 'Tất cả đánh giá', value: null },
        { label: '5 Sao', value: 5 },
        { label: '4 Sao', value: 4 },
        { label: '3 Sao', value: 3 },
        { label: '2 Sao', value: 2 },
        { label: '1 Sao', value: 1 },
    ];

    // Animation cho từng item
    const itemAnims = useRef(filterOptions.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        if (visible) {
            // Animate Bottom Sheet trượt lên
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 40,
                friction: 10,
                useNativeDriver: true,
            }).start();

            // Animate các item tuần tự (stagger)
            const animations = filterOptions.map((_, i) => {
                return Animated.spring(itemAnims[i], {
                    toValue: 1,
                    tension: 50,
                    friction: 10,
                    useNativeDriver: true,
                });
            });
            Animated.stagger(60, animations).start();

        } else {
            // Reset animations khi đóng
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 250,
                useNativeDriver: true,
            }).start();
            itemAnims.forEach(anim => anim.setValue(0));
        }
    }, [visible]);

    const handleSelect = (value) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelectFilter(value);
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {/* Lớp nền mờ */}
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}>
                 <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            </TouchableOpacity>

            {/* Nội dung Bottom Sheet */}
            <Animated.View style={[
                styles.bottomSheetContainer,
                { transform: [{ translateY: slideAnim }] }
            ]}>
                <View style={styles.headerModal}>
                    <View style={styles.grabber} />
                    <Text style={styles.modalTitle}>Lọc theo đánh giá</Text>
                </View>

                {filterOptions.map((option, index) => {
                    const isActive = option.value === activeFilter;
                    const count = option.value ? distribution[option.value] : totalReviews;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    
                    const itemStyle = {
                        opacity: itemAnims[index],
                        transform: [
                            {
                                translateX: itemAnims[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-30, 0],
                                }),
                            },
                        ],
                    };

                    return (
                        <Animated.View key={option.label} style={itemStyle}>
                            <TouchableOpacity
                                style={[styles.filterOptionRow, isActive && styles.activeFilterRow]}
                                onPress={() => handleSelect(option.value)}
                            >
                                <View style={styles.optionLabelContainer}>
                                    <Text style={[styles.optionStarText, isActive && styles.activeText]}>{option.value || 'All'}</Text>
                                    {option.value && <Ionicons name="star" size={16} color={isActive ? COLORS.primary : COLORS.warning} />}
                                </View>
                                <View style={styles.optionBarContainer}>
                                    <View style={styles.distBarBackground}>
                                        <View style={[styles.distBarForeground, { width: `${percentage}%` }]} />
                                    </View>
                                </View>
                                <Text style={styles.optionCountText}>{count}</Text>
                                {isActive && <AntDesign name="checkcircle" size={22} color={COLORS.primary} style={styles.checkIcon} />}
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </Animated.View>
        </Modal>
    );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
    bottomSheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(252, 252, 252, 0.95)', 
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 24,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    headerModal: {
        alignItems: 'center',
        paddingBottom: 15,
    },
    grabber: {
        width: 50,
        height: 5,
        backgroundColor: '#C9C9D0',
        borderRadius: 2.5,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1c1c1e',
    },
    filterOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginHorizontal: 16,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeFilterRow: {
        backgroundColor: 'rgba(230, 245, 255, 0.9)', 
        borderColor: COLORS.primary,
    },
    optionLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 65,
    },
    optionStarText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 4,
        width: 25,
    },
    activeText: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    optionBarContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    distBarBackground: {
        height: 8,
        backgroundColor: '#EAEAEA',
        borderRadius: 4,
    },
    distBarForeground: {
        height: '100%',
        backgroundColor: COLORS.warning,
        borderRadius: 4,
    },
    optionCountText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        width: 40,
        textAlign: 'right',
    },
    checkIcon: {
        position: 'absolute',
        right: -10,
        top: -8,
        backgroundColor: '#FCFCFC',
        borderRadius: 15,
    },
});

export default ReviewFilterModal;