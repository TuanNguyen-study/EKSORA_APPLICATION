import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../constants/colors';
import { getUser } from '../../../API/services/servicesUser';
import { updateUserProfile } from '../../../API/services/servicesProfile';


const InputRow = ({ iconName, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry = false, onPress }) => (
    <TouchableOpacity style={styles.inputRow} activeOpacity={onPress ? 0.8 : 1} onPress={onPress}>
        <Ionicons name={iconName} size={22} color={COLORS.darkGray} style={styles.inputIcon} />
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.darkGray}
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
        const fetchData = async () => {
            try {
                const user = await getUser();
                setFullName(user.first_name || '');
                setPhone(user.phone || '');
                setEmail(user.email || '');
                setAddress(user.address || '');

                // Ưu tiên lấy city từ API, nếu không có thì lấy từ AsyncStorage
                if (user.city) {
                    setCity(user.city);
                } else {
                    const cityFromStorage = await AsyncStorage.getItem('city');
                    if (cityFromStorage) setCity(cityFromStorage);
                }

                const cardName = await AsyncStorage.getItem('cardName');
                const cardNumber = await AsyncStorage.getItem('cardNumber');
                const expiryDate = await AsyncStorage.getItem('expiryDate');
                const cvv = await AsyncStorage.getItem('cvv');

                if (cardName) setCardName(cardName);
                if (cardNumber) setCardNumber(cardNumber);
                if (expiryDate) setExpiryDate(expiryDate);
                if (cvv) setCvv(cvv);
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
            }
        };


        fetchData();
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
        if (!fullName || !phone || !email || !address || !city) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem("ACCESS_TOKEN");
            await updateUserProfile(token, {
                first_name: fullName,
                phone,
                email,
                address,
                city,
            });

            await AsyncStorage.setItem('city', city);
            await AsyncStorage.setItem('cardName', cardName);
            await AsyncStorage.setItem('cardNumber', cardNumber);
            await AsyncStorage.setItem('expiryDate', expiryDate);
            await AsyncStorage.setItem('cvv', cvv);

            Alert.alert('Thành công', 'Thông tin của bạn đã được cập nhật.');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
                    <InputRow iconName="person-outline" placeholder="Họ và tên" value={fullName} onChangeText={setFullName} />
                    <InputRow iconName="call-outline" placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <InputRow iconName="mail-outline" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Địa chỉ của bạn</Text>
                    <InputRow iconName="location-outline" placeholder="Số nhà, tên đường..." value={address} onChangeText={setAddress} />
                    <InputRow iconName="business-outline" placeholder="Thành phố / Tỉnh" value={city} onChangeText={setCity} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
                    <InputRow iconName="person-circle-outline" placeholder="Tên trên thẻ" value={cardName} onChangeText={setCardName} />
                    <InputRow iconName="card-outline" placeholder="Số thẻ" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <InputRow iconName="calendar-outline" placeholder="Ngày hết hạn (MM/YY)" value={expiryDate} onPress={() => setShowDatePicker(true)} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <InputRow iconName="lock-closed-outline" placeholder="CVV" value={cvv} onChangeText={setCvv} keyboardType="numeric" secureTextEntry />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
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
        shadowOpacity: 0.08,
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
