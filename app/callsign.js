import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';

export default function Callsign() {

    const [callsign, setCallsign] = useState(["", "", ""]);

    const handleCharChanged = (value, index) => {
        console.log("Changing value at index:", index, "to:", value);
        const newCallsign = callsign.map((char, curIndex) => {
            if (curIndex === index) {
                return value.toUpperCase();
            } else {
                return char;
            }
        });
        console.log("New callsign:", newCallsign);
        const writeCallsignToFile = async () => {
            console.log("Saving callsign to file...");
            const filePath = FileSystem.documentDirectory + 'callsign.json';
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(newCallsign, null, 2));
        }
        writeCallsignToFile();
        setCallsign(newCallsign);
    }

    useEffect(() => {
        const readCallsignFromFile = async () => {
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
        readCallsignFromFile();
    }, []);



    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, padding: 20, gap: 10 }}>
            <Text style={styles.headText}>Callsign</Text>
            <View style={styles.inputBoxContainer}>
                <TextInput style={styles.inputBox} value={callsign[0]} maxLength={1} onChangeText={(text) => handleCharChanged(text, 0)} />
                <TextInput style={styles.inputBox} value={callsign[1]} maxLength={1} onChangeText={(text) => handleCharChanged(text, 1)} />
                <TextInput style={styles.inputBox} value={callsign[2]} maxLength={1} onChangeText={(text) => handleCharChanged(text, 2)} />
            </View>
            <Text style={styles.descriptionText}>Enter a 3 character sequence to identify yourself in chats</Text>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    headText: {
        fontSize: 30.0,
        textAlign: "center",
    },
    descriptionText: {
        fontSize: 20.0,
        textAlign: "center",
    },
    inputBoxContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        gap: 20,
        maxheight: 10,
    },
    inputBox: {
        fontSize: 18,
        fontStyle: 'bold',
        borderBlockColor: 'black',
        borderWidth: 5,
        textAlign: 'center',
        minWidth: '10%',
    }
});