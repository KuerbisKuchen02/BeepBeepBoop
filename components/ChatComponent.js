import MorseMessage from "./MorseMessage";
import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";


export default function ChatComponent() {
    "use strict";

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        addDummyMessages();  // Dummy messages for testing
    }, []);

    const addDummyMessages = () => {
        const dummyMessages = [
            {
                id: 0,
                callsign: "CS1",
                uri: "Invalider Pfad zu Test Zwecken",
                text: "Hello, this is a test message.",
                morse: "... --- ...",
                time: "10:00",
                isSendByMe: true,
            },
            {
                id: 1,
                callsign: "CS2",
                uri: null,
                text: "Testing Morse code.",
                morse: "- .... .. ... / .. ...",
                time: "10:00",
                isSendByMe: false,
            },
            {
                id: 2,
                callsign: 'KJ7XYZ',
                text: 'Hello, can you read me?',
                morse: '.... . .-.. .-.. ---',
                uri: null,
                time: "10:00",
                isSendByMe: false,
            },
            {
                id: 3,
                callsign: 'N0CALL',
                text: 'Loud',
                morse: '.-.. --- ..- -..',
                uri: null,
                time: "10:00",
                isSendByMe: true,
            },
            {
                id: 4,
                callsign: 'KJ7XYZ',
                text: null,
                morse: '-.-. -- ... / -.-. .... . -.-. -.-',
                uri: null,
                time: "10:00",
                isSendByMe: false,
            },
            {
                id: 5,
                callsign: 'N0CALL',
                text: 'Check this audio',
                morse: '-.-. .... . -.-. -.- / .- ..- -.. .. ---',
                uri: null,
                time: "10:00",
                isSendByMe: true,
            },
            {
                id: 6,
                callsign: 'N0CALL',
                text: 'Loud',
                morse: '.-.. --- ..- -..',
                uri: null,
                time: "10:00",
                isSendByMe: true,
            },
            {
                id: 7,
                callsign: 'KJ7XYZ',
                text: null,
                morse: '-.-. -- ... / -.-. .... . -.-. -.-',
                uri: null,
                time: "10:00",
                isSendByMe: false,
            },
            {
                id: 8,
                callsign: 'N0CALL',
                text: 'Check this audio',
                morse: '-.-. .... . -.-. -.- / .- ..- -.. .. ---',
                uri: null,
                time: "10:00",
                isSendByMe: true,
            },
        ];
        setMessages(dummyMessages);
    }

    const handleAddMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    }

    return (
        <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.chatContainer}
            renderItem={({ item }) => (
                <MorseMessage
                    id={item.id}
                    callsign={item.callsign}
                    uri={item.uri}
                    text={item.text}
                    morse={item.morse}
                    time={item.time}
                    isSendByMe={item.isSendByMe}
                />
            )} >
        </FlatList>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    chatContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        gap: 10,
    },
})