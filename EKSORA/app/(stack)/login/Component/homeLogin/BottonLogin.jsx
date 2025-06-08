import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CheckBox from '../../../../../components/CheckBox';

export default function BottonLogin() {
    const [agree, setAgree] = useState(false);


    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {/* <CheckBox value={agree} onValueChange={setAgree} /> */}
                <Text style={styles.text}>
                    Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với Điều Khoản Sử Dụng Chung và Chính Sách Bảo Mật của EKSORA
                </Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 150,
        paddingHorizontal: 10,
        marginBottom: 100,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    text: {
        fontSize: 10,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
});
