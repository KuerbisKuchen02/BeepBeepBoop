import { StyleSheet } from 'react-native'

const primaryColor = '#1C2435';
const disabledColor = 'lightgray';

export default StyleSheet.create({
    home_view: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 50 
    },

    page_view: {
        flex: 1, 
        padding: 20, 
        paddingTop: 30, 
        gap: 10
    },

    homeImage: {
        width: "50%",
        height: "30%",
        resizeMode: 'contain',
    },

    homeButton: {
        width: "50%"
    },

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

    chat_container: {
        flex: 1
    },

    callsign_container: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        gap: 20,
        maxheight: 10,
        marginVertical: 20,
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
    },

    chatContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
        gap: 10,
    },

    icon_button: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon_border_button: {
        borderWidth: 3,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 50
    },

    messagebox: {
        alignSelf: 'flex-end',
        maxWidth: '80%',
        borderRadius: 25,
        flexDirection: 'row',
        backgroundColor: 'lightgreen',
        borderWidth: 3,
        borderColor: 'darkgray',
        padding: 10,
        gap: 5,
    },

    messagebox_retrieved: {
        alignSelf: 'flex-start',
        backgroundColor: 'mintcream',
    },

    message_main_container: {
        flex: 5,
        gap: 2,
    },

    message_second_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    message_callsign: {
        fontSize: 10,
        fontWeight: 'bold',
        textDecorationColor: 'black',
        textDecorationLine: 'underline',
    },

    message_text: {

    },

    message_morse: {
        fontSize: 18,
    },

    message_time: {
        alignSelf: 'flex-end'
    },

    learn_box_with_icon: {
        flexDirection: 'row',
        columnGap: 10
    },

    learn_info_text: {
        fontSize: 20,
        alignSelf: 'flex-start'
    },

    learn_morse_text: {
        fontSize: 30,
        borderWidth: 3,
        width: "80%",
        alignSelf: 'center',
        backgroundColor: 'lightgray'
    },

    learn_text_input: {
        fontSize: 30,
        borderBottomWidth: 3,
        width: "80%",
        alignSelf: 'flex-start'
    }

});