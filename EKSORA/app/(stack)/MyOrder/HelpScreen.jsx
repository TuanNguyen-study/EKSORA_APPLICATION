import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
    Linking,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors'; 

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}



// Accordion Item
const AccordionItem = ({ title, children, isOpen, onPress }) => (
    <View style={styles.accordionContainer}>
        <TouchableOpacity style={styles.accordionHeader} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.accordionTitle}>{title}</Text>
            <Ionicons
                name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={24}
                color={COLORS.primary}
            />
        </TouchableOpacity>
        {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
);

// Nội dung dòng
const ContentRow = ({ text, isLink = false, linkUrl = '' }) => {
    const handlePress = () => {
        if (isLink && linkUrl) {
            Linking.openURL(linkUrl).catch(err => console.error("Couldn't load page", err));
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} disabled={!isLink}>
            <View style={styles.contentRow}>
                <Ionicons name="ellipse-sharp" size={8} color={COLORS.textLight} style={styles.bulletIcon} />
                <Text style={[styles.contentText, isLink && styles.linkText]}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function HelpScreen() {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header với nút Back */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Trung tâm Trợ giúp</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Ionicons name="help-buoy-outline" size={40} color={COLORS.primary} />
                    <Text style={styles.headerTitle}>Chào mừng bạn đến với Eksora!</Text>
                    <Text style={styles.headerSubtitle}>
                        Chúng tôi luôn sẵn sàng hỗ trợ để hành trình của bạn trở nên tuyệt vời hơn.
                    </Text>
                </View>

                {/* Accordion Items */}
                <AccordionItem
                    title="1. Hướng dẫn sử dụng Eksora"
                    isOpen={activeIndex === 0}
                    onPress={() => toggleAccordion(0)}
                >
                    <ContentRow text="Tìm kiếm điểm đến: Nhập tên địa điểm hoặc sử dụng bản đồ tích hợp." />
                    <ContentRow text="Đặt tour: Chọn tour, kiểm tra chi tiết, và đặt chỗ qua vài bước đơn giản." />
                    <ContentRow text="Quản lý chuyến đi: Theo dõi lịch trình, vé trong phần 'Hành trình của tôi'." />
                    <ContentRow text="Tính năng Grok 3: Trò chuyện với AI để nhận gợi ý du lịch và thông tin." />
                    <ContentRow text="Đánh giá và nhận xét: Chia sẻ trải nghiệm sau chuyến đi." />
                </AccordionItem>

                <AccordionItem
                    title="2. Giải pháp cho vấn đề thường gặp"
                    isOpen={activeIndex === 1}
                    onPress={() => toggleAccordion(1)}
                >
                    <ContentRow text="Ứng dụng không tải được: Kiểm tra internet hoặc cập nhật phiên bản mới." />
                    <ContentRow text="Không nhận được xác nhận: Kiểm tra email (kể cả spam) hoặc liên hệ hỗ trợ." />
                    <ContentRow text="Lỗi kỹ thuật: Gửi báo cáo chi tiết qua phần 'Phản hồi' trong ứng dụng." />
                </AccordionItem>

                <AccordionItem
                    title="3. Chính sách bảo mật"
                    isOpen={activeIndex === 2}
                    onPress={() => toggleAccordion(2)}
                >
                    <ContentRow text="Dữ liệu cá nhân được mã hóa và bảo mật tuyệt đối." />
                    <ContentRow text="Dễ dàng quản lý hoặc xóa lịch sử trò chuyện trong Cài đặt." />
                    <ContentRow
                        text="Xem chi tiết chính sách tại đây."
                        isLink={true}
                        linkUrl="https://eksora.com/privacy"
                    />
                </AccordionItem>

                <AccordionItem
                    title="4. Thông tin liên hệ"
                    isOpen={activeIndex === 3}
                    onPress={() => toggleAccordion(3)}
                >
                    <ContentRow text="Email hỗ trợ: support@eksora.com" isLink linkUrl="mailto:support@eksora.com" />
                    <ContentRow text="Đường dây nóng: +84 123 456 789" isLink linkUrl="tel:+84123456789" />
                    <ContentRow text="Trò chuyện trực tiếp" isLink linkUrl="https://eksora.com/live-chat" />
                    <ContentRow text="Văn phòng: Tòa nhà ABC, 123 Đường Lê Lợi, Q1, TP.HCM" />
                </AccordionItem>

                <AccordionItem
                    title="5. Câu hỏi thường gặp (FAQ)"
                    isOpen={activeIndex === 4}
                    onPress={() => toggleAccordion(4)}
                >
                    <ContentRow text="Làm thế nào để hủy tour? Vào 'Hành trình của tôi', chọn tour và làm theo hướng dẫn (có thể áp dụng phí hủy)." />
                    <ContentRow text="Thanh toán có an toàn không? Có, chúng tôi dùng cổng thanh toán mã hóa như Visa, Mastercard, MoMo." />
                </AccordionItem>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        marginRight: 10,
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    header: {
        backgroundColor: COLORS.white,
        padding: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: 10,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
    accordionContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    accordionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.textDark,
        flex: 1,
        marginRight: 10,
    },
    accordionContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 12,
    },
    bulletIcon: {
        marginRight: 12,
        marginTop: 7,
    },
    contentText: {
        fontSize: 15,
        color: COLORS.textLight,
        flex: 1,
        lineHeight: 22,
    },
    linkText: {
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
});
