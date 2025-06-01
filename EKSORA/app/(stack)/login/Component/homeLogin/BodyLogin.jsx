import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, onPress } from 'react-native';

export default function BodyLogin() {




    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text} onPress={ ()=> router.push('/(stack)/login/loginPhone') }>Số điện thoại</Text>

                    <Feather name="phone" size={24} color="white" style={styles.image} />

                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style={styles.button1}>
                    <Text style={styles.text}>Facebook</Text>
                    <FontAwesome name="facebook" size={24} color="white" style={styles.image} />
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style={styles.button3}>
                    <Text style={styles.text}>Google</Text>
                    <AntDesign name="googleplus" size={24} color="white" style={styles.image} />
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style={styles.button2}>
                    <Text style={styles.text}  onPress={ ()=> router.push('/(stack)/login/loginEmail')}>Email</Text>
                    <Feather name="mail" size={24} color="white" style={styles.image} />
                </TouchableOpacity>
            </View>


            <View>
                <Text style={styles.text1} onPress={(onPress)}>Lựa chọn khác</Text>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },



    button: {
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        padding: 10,
        width: 395,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,

    },

    button1: {
        backgroundColor: '#014BBA',
        borderRadius: 30,
        padding: 10,
        width: 395,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,

    },

    button2: {
        backgroundColor: '#CACACA',
        borderRadius: 30,
        padding: 10,
        width: 395,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,

    },

    button3: {
        backgroundColor: '#FF3A46',
        borderRadius: 30,
        padding: 10,
        width: 395,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,

    },

    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'normal',
        fontWeight: 'bold',
        marginBottom: 20,
    },

    image: {
        position: 'absolute',
        left: 10,
        marginLeft: 20,
    },

    text1: {
        textDecorationLine: 'underline',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },




})