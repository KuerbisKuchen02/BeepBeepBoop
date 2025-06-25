import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import BackArrowComponent from '../components/BackArrowComponent';
import styles from '../styles.js';

export default function Callsign() {

    const [callsign, setCallsign] = useState(["", "", ""]);

    /**
     * Gets called when the user changes one of the three characters of the callsign.
     * @param {char} value: New character of callsign
     * @param {int} index: Index of the new character [0-2]
     */
    function handleCharChanged(value, index) {
        console.log("callsign:handleCharged: Changing value at index:", index, "to:", value);
        const newCallsign = callsign.map((char, curIndex) => {
            if (curIndex === index) {
                return value.toUpperCase();
            } else {
                return char;
            }
        });
        console.log("callsign:handleCharged: New callsign:", newCallsign);
        const writeCallsignToFile = async () => {
            console.log("callsign:handleCharged: Saving callsign to file...");
            const filePath = FileSystem.documentDirectory + 'callsign.json';
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(newCallsign, null, 2));
        }
        writeCallsignToFile();
        setCallsign(newCallsign);
    }

    /**
     * Loads the saved callsign from the filesystem and initialises the corresponding useState accordingly.
     */
    async function readCallsignFromFile() {
        console.log("Loading callsign from file...");
        try {
            const filePath = FileSystem.documentDirectory + 'callsign.json';
            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const callSign = JSON.parse(fileContent);
            console.log("Callsign loaded:", callSign);
            setCallsign(callSign.map(char => char.toUpperCase()));
        } catch (error) {
            console.error("Error reading callsign from file:", error);
        }
    }

    useEffect(() => {
        readCallsignFromFile();
    }, []);


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.page_view}>
            <BackArrowComponent></BackArrowComponent>
            <Text style={[styles.h1_text]}>Callsign</Text>
            <View style={styles.callsign_container}>
                <TextInput style={styles.callsign_input} value={callsign[0]} maxLength={1} onChangeText={(text) => handleCharChanged(text, 0)} />
                <TextInput style={styles.callsign_input} value={callsign[1]} maxLength={1} onChangeText={(text) => handleCharChanged(text, 1)} />
                <TextInput style={styles.callsign_input} value={callsign[2]} maxLength={1} onChangeText={(text) => handleCharChanged(text, 2)} />
            </View>
            <Text style={styles.section_text}>Enter a 3 character sequence to identify yourself in chats</Text>
        </KeyboardAvoidingView>
    );
};