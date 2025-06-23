import MorseMessage from "./MorseMessage";
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import InputComponent from '../components/InputComponent.js';
import BackArrowComponent from "./BackArrowComponent.js";

export default function ChatComponent() {
    "use strict";

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const filePath = FileSystem.documentDirectory + 'chatMessages.json';
        const readMessagesFromFile = async () => {
            console.log("Loading messages from file...");
            try {
                const fileContent = await FileSystem.readAsStringAsync(filePath);
                const loadedMessages = JSON.parse(fileContent);
                setMessages(loadedMessages);
            } catch (error) {
                console.error("Error reading messages from file:", error);
            }
        }
        readMessagesFromFile();
    }, []);

    const handleAddMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);

        const writeMessagesToFile = async () => {
            console.log("Saving messages to file...");
            const filePath = FileSystem.documentDirectory + 'chatMessages.json';
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify([...messages, message], null, 2));
        }
        writeMessagesToFile()
    }

    const addMessage = (text, morse, callsign, isSendByMe, uri) => {
        const newMessage = {
            id: messages.length,
            callsign: callsign,
            uri: uri,
            text: text,
            morse: morse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSendByMe: isSendByMe,
        };
        handleAddMessage(newMessage);
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eeeeee', padding: 20 }}>
            <BackArrowComponent></BackArrowComponent>
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
            <InputComponent addMessage={addMessage}/>
        </View>
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
        marginBottom: 20,
        paddingHorizontal: 10,
        gap: 10,
    },
})