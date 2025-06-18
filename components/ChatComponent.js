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
                callsign: "CS1",
                uri: "https://example.com/audio1.mp3",
                text: "Hello, this is a test message.",
                morse: "... --- ...",
                time: Date.now(),
                isSendByMe: true,
            },
            {
                callsign: "CS2",
                uri: "https://example.com/audio2.mp3",
                text: "Testing Morse code.",
                morse: "- .... .. ... / .. ...",
                time: Date.now() + 1000,
                isSendByMe: false,
            },
            {
                callsign: 'KJ7XYZ',
                text: 'Hello, can you read me?',
                morse: '.... . .-.. .-.. ---',
                uri: null,
                time: Date.now() - 60000,
                isSendByMe: false,
            },
            {
                callsign: 'N0CALL',
                text: 'Loud',
                morse: '.-.. --- ..- -..',
                uri: null,
                time: Date.now() - 55000,
                isSendByMe: true,
            },
            {
                callsign: 'KJ7XYZ',
                text: null,
                morse: '-.-. -- ... / -.-. .... . -.-. -.-',
                uri: null,
                time: Date.now() - 50000,
                isSendByMe: false,
            },
            {
                callsign: 'N0CALL',
                text: 'Check this audio',
                morse: '-.-. .... . -.-. -.- / .- ..- -.. .. ---',
                uri: 'https://example.com/audio1.mp3',
                time: Date.now() - 45000,
                isSendByMe: true,
            },
            {
                callsign: 'N0CALL',
                text: 'Loud',
                morse: '.-.. --- ..- -..',
                uri: null,
                time: Date.now() - 55000,
                isSendByMe: true,
            },
            {
                callsign: 'KJ7XYZ',
                text: null,
                morse: '-.-. -- ... / -.-. .... . -.-. -.-',
                uri: null,
                time: Date.now() - 50000,
                isSendByMe: false,
            },
            {
                callsign: 'N0CALL',
                text: 'Check this audio',
                morse: '-.-. .... . -.-. -.- / .- ..- -.. .. ---',
                uri: 'https://example.com/audio1.mp3',
                time: Date.now() - 45000,
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
            renderItem={({ item }) => (
                <MorseMessage
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
        gap: 10,
        width: Dimensions.get("window").width,
        paddingHorizontal: 10,
    },
})