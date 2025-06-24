import { StyleSheet } from 'react-native'

const primaryColor = '#1C2435';
const disabledColor = 'lightgray';

export default StyleSheet.create({
    h1_text: {
        fontSize: 30.0,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },

    section_text: {
        fontSize: 20.0,
        textAlign: "center",
    },

    button_body_enabled: {
        backgroundColor: primaryColor,
    },

    button_text_enabled: {
        color: 'white',
    },

    button_body_disabled: {
        backgroundColor: disabledColor,
    },

    button_text_disabled: {
        color: 'darkgray',
    },

    button_text: {
        fontSize: 20.0,
        textAlign: 'center',
    },

    button_body: {
        borderRadius: 10,
        padding: 15,
    },

    callsign_input: {
        borderRadius: 10,
        padding: 20,
        fontSize: 20.0,
        fontStyle: 'bold',
        borderBlockColor: 'black',
        borderWidth: 5,
        textAlign: 'center',
        minWidth: '10%',
    }
});