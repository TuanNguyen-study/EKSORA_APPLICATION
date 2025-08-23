import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { updateUserProfile } from '../../../API/services/servicesProfile';
import { COLORS } from '../../../constants/colors';
import Toast from 'react-native-toast-message'; // ✅ thêm Toast


// Component InputRow có thể tùy chỉnh màu placeholder
const InputRow = ({
    iconName,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    onPress,
    placeholderTextColor = COLORS.separator, // mặc định là darkGray
}) => (
    <TouchableOpacity
        style={styles.inputRow}
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
    >
        <Ionicons
            name={iconName}
            size={22}
            color={COLORS.darkGray}
            style={styles.inputIcon}
        />
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize="words"
            editable={!onPress}
            pointerEvents={onPress ? 'none' : 'auto'}
        />
    </TouchableOpacity>
);

const getUserProfile = async () => {
    try {
        const userProfileStr = await AsyncStorage.getItem('USER_PROFILE');
        console.log('Raw user profile:', userProfileStr);
        if (!userProfileStr) {
            throw new Error('Không tìm thấy thông tin người dùng');
        }
        return JSON.parse(userProfileStr);
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

export default function UserInfoScreen() {
    const navigation = useNavigation();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userProfile = await getUserProfile();
                console.log('Fetched user profile:', userProfile);

                // Ưu tiên trường name, nếu không có thì ghép first_name + last_name
                let displayName = userProfile.name;
                if (!displayName || displayName.trim() === '') {
                    displayName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
                }
                setFullName(displayName);

                setPhone(userProfile.phone || '');
                setEmail(userProfile.email || '');
                setAddress(userProfile.address || '');
                setCity(userProfile.city || '');

                // Lấy thông tin thanh toán từ AsyncStorage
                const paymentInfo = await AsyncStorage.multiGet([
                    'cardName',
                    'cardNumber',
                    'expiryDate',
                    'cvv'
                ]);

                const [
                    [, savedCardName],
                    [, savedCardNumber],
                    [, savedExpiryDate],
                    [, savedCvv]
                ] = paymentInfo;

                if (savedCardName) setCardName(savedCardName);
                if (savedCardNumber) setCardNumber(savedCardNumber);
                if (savedExpiryDate) setExpiryDate(savedExpiryDate);
                if (savedCvv) setCvv(savedCvv);

            } catch (error) {
                console.error('Error fetching user data:', error);
                Toast.show({
                  type: "error",
                  text1: "Lỗi",
                  text2: "Không thể tải thông tin người dùng",
                });
            }
        };

        fetchUserData();
    }, []);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const month = selectedDate.getMonth() + 1;
            const year = selectedDate.getFullYear().toString().slice(-2);
            setExpiryDate(`${month < 10 ? '0' + month : month}/${year}`);
        }
    };

    const handleSaveChanges = async () => {
        if (!fullName || !phone || !email) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Vui lòng điền đầy đủ thông tin cần thiết",
            });
            return;
        }

        try {
            const token = await AsyncStorage.getItem("ACCESS_TOKEN");
            const currentProfile = await getUserProfile();

            // Cập nhật thông tin người dùng
            const updatedProfile = {
                ...currentProfile,
                name: fullName,
                phone,
                email,
                address,
                city,
            };

            // Lưu vào AsyncStorage
            await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(updatedProfile));

            // Lưu thông tin thanh toán
            await AsyncStorage.multiSet([
                ['cardName', cardName],
                ['cardNumber', cardNumber],
                ['expiryDate', expiryDate],
                ['cvv', cvv],
            ]);

            // Gọi API cập nhật
            await updateUserProfile(token, updatedProfile);

            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Thông tin đã được cập nhật",
            });

        } catch (error) {
            console.error('Error saving changes:', error);
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Không thể cập nhật thông tin",
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin thanh toán</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
                    <InputRow
                        iconName="person-outline"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <InputRow
                        iconName="call-outline"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    <InputRow
                        iconName="mail-outline"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Địa chỉ của bạn</Text>
                    <InputRow
                        iconName="location-outline"
                        placeholder="Số nhà, tên đường..."
                        value={address}
                        onChangeText={setAddress}
                    />
                    <InputRow
                        iconName="business-outline"
                        placeholder="Thành phố / Tỉnh"
                        value={city}
                        onChangeText={setCity}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
                    <InputRow
                        iconName="person-circle-outline"
                        placeholder="Tên trên thẻ"
                        value={cardName}
                        onChangeText={setCardName}
                    />
                    <InputRow
                        iconName="card-outline"
                        placeholder="Số thẻ"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                    />
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <InputRow
                                iconName="calendar-outline"
                                placeholder="Ngày hết hạn (MM/YY)"
                                value={expiryDate}
                                onPress={() => setShowDatePicker(true)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <InputRow
                                iconName="lock-closed-outline"
                                placeholder="CVV"
                                value={cvv}
                                onChangeText={setCvv}
                                keyboardType="numeric"
                                secureTextEntry
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveChanges}
                >
                    <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    onChange={handleDateChange}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.separator,
        backgroundColor: COLORS.white,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 20,
        backgroundColor: COLORS.lightGray,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.separator,
        paddingBottom: 8,
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
        paddingVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.separator,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
