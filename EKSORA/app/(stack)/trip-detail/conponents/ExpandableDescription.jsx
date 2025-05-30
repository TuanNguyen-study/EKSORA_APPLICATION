// app/(stack)/trip-detail/components/ExpandableDescription.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ExpandableDescription = ({ title, description, initialLines = 5 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const onTextLayout = useCallback(e => {
    // Chỉ hiển thị nút "Xem thêm" nếu nội dung thực sự dài hơn số dòng ban đầu
    // Điều này hơi khó đo chính xác với numberOfLines, nên sẽ dựa vào chiều cao
    // Giả sử chiều cao trung bình của 1 dòng là 20
    const estimatedHeight = e.nativeEvent.layout.height;
    setTextHeight(estimatedHeight);
    if (!isExpanded && estimatedHeight > initialLines * 20) { // Điều chỉnh số 20 nếu cần
        setShowMoreButton(true);
    } else if (isExpanded) {
        setShowMoreButton(true); // Luôn hiển thị nút "Thu gọn" khi đã mở
    } else {
        setShowMoreButton(false);
    }
  }, [isExpanded, initialLines]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View onLayout={(event) => setLayoutHeight(event.nativeEvent.layout.height)}>
        <Text
            style={styles.descriptionText}
            numberOfLines={isExpanded ? undefined : initialLines}
            onTextLayout={onTextLayout} // Sử dụng onTextLayout để quyết định có hiển thị nút không
        >
            {description}
        </Text>
      </View>

      {showMoreButton && (
        <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={18}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10, // Giảm padding nếu separator đã có margin
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'justify',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  toggleButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default ExpandableDescription;