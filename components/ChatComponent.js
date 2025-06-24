import MorseMessage from "./MorseMessage";
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Button } from "react-native";
import InputComponent from '../components/InputComponent.js';
import BackArrowComponent from "./BackArrowComponent.js";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { encodeMorse } from "../morse_util.js";

export default function ChatComponent() {
    "use strict";

    const [messages, setMessages] = useState([]);
    const [playLastMessage, setPlayLastMessage] = useState(false);
    const [isPlayingId, setIsPlayingId] = useState(-1);
    const [isLoadingId, setIsLoadingId] = useState(-1);
    const player = useAudioPlayer();
    const playerStatus = useAudioPlayerStatus(player);

    // Load messages from file when the component mounts
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

    // Save messages to file whenever messages change
    useEffect(() => {
        const writeMessagesToFile = async () => {
            console.log("Saving messages to file...");
            const filePath = FileSystem.documentDirectory + 'chatMessages.json';
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify([...messages], null, 2));
        }
        writeMessagesToFile()
    }, [messages]);

    // Stop audio playback when audio is finished
    useEffect(() => {
        if (playerStatus.didJustFinish && playerStatus.playing) {
            console.log("Audio finished playing, resetting player");
            player.seekTo(0);
            player.pause();
            setIsPlayingId(-1);
        }
    }, [playerStatus]);

    // Play last message automatically when playLastMessage is true
    useEffect(() => {
        console.log("Available messages after adding new message:", messages);
        if (playLastMessage) {
            console.log("Playing last message automatically...");
            const message = messages[messages.length - 1];
            handleButtonClick(message.id, null);
            setPlayLastMessage(false);
        }
    }, [messages, playLastMessage]);

    // Clear messages for debugging purposes
    const clearMessages = () => {
        console.log("Clearing messages...");
        setMessages([]);
        const filePath = FileSystem.documentDirectory + 'chatMessages.json';
        FileSystem.writeAsStringAsync(filePath, JSON.stringify([]))
            .then(() => {
                console.log("Messages cleared and saved to file.");
            })
            .catch((error) => {
                console.error("Error clearing messages:", error);
            });
    }

    /**
     * Try's to validate the uri path, if invalid try's create a Uri from other data from message.
     * If the path (uri) isn't valid, a uri will be created from the morse of the message.
     * If the morse is null, a morse will be created from the text of the message.
     * If the text is also null no uri can be created.
     * Returns true when path existed, otherwise returns false.
     * @param message: Message object containing the uri, morse and text data.
     * @returns string uri or null if no uri could be created.
     */
    async function validateUri(message) {
        console.log("Validating URI for message:", message);
        let uri = message.uri;
        // Check wheter the uri is available and valid
        try {
            let fileSystemInfo = { exists: false };
            if (uri != null) {
                fileSystemInfo = await FileSystem.getInfoAsync(uri);
            }

            if (fileSystemInfo.exists) {
                return uri;
            }

            console.warn("Uri Path is invalid, try to create uri via morse data")
            if (message.morse == null && message.text == null) {
                console.error("Error while trying to create Uri. No data to create Uri from!");
                return null;
            }

            let morse = message.morse;
            if (morse == null) {
                console.warn("Morse data isn't available, trying to create morse via text data")
                morse = await textToMorse(text);
            }
            uri = await encodeMorse(morse, "message_" + message.id);
        } catch (error) {
            console.error("Error while trying to create Uri from other data!");
            console.error(error);
            return null;
        }
        console.log("Created new URI from morse data:", uri);
        return uri;
    }

    const updateMessage = (id, newMessage) => {
        console.log("Updating message with ID:", id);
        console.log("New message data:", newMessage);
        // TODO: update saved messages in file
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[id] = newMessage;
            return updatedMessages;
        });
    }

    const handleButtonClick = async (id, uri) => {
        console.log("Button clicked for message ID:", id);
        const message = messages[id];
        if (!message) {
            console.error("Message not found for ID:", id);
            console.log("Available messages:", messages);
            return;
        }
        setIsLoadingId(id);
        message.uri = uri = await validateUri(message)
        updateMessage(id, message);
        setIsLoadingId(-1);
        if (uri == null) {
            console.error("Cannot play audio no uri", id);
            return;
        }

        if (playerStatus.playing && isPlayingId === id) {
            console.log("Stopping audio for message ID:", id);
            player.pause();
            player.seekTo(0);
            setIsPlayingId(-1);
        } else {
            console.log("Playing audio from URI:", uri);
            setIsPlayingId(id);
            player.replace({ uri: uri });
            player.seekTo(0);
            player.play();
        }
    }

    const addMessage = (text, morse, callsign, uri=null, isSendByMe=false, autoPlay=false) => {
        console.log("Adding new message:", { text, morse, callsign, isSendByMe, uri, autoPlay });
        setPlayLastMessage(autoPlay);
        const newMessage = {
            id: messages.length,
            callsign: callsign,
            text: text,
            uri: uri,
            morse: morse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSendByMe: isSendByMe
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eeeeee', padding: 20, paddingTop: 30 }}>
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
                        handleButtonClick={handleButtonClick}
                        isPlaying={isPlayingId === item.id}
                        isLoading={isLoadingId === item.id}
                    />
                )} >
            </FlatList>
            <Button title="Clear Messages" onPress={clearMessages} color="red" />
            <InputComponent addMessage={addMessage} />
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