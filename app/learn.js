import { KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import { useState, useEffect } from 'react';
import { useAudioPlayer } from "expo-audio";
import BackArrowComponent from '../components/BackArrowComponent';
import { textToMorse, encodeMorse } from '../morse_util';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import learnWords from '../assets/data/learnwords.json';

export default function learn(){
    "use strict";

    const [words, setWords] = useState(null);
    const [morse, setMorse] = useState("");
    const [textInput, setTextInput] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const player = useAudioPlayer();

    useEffect (() => {
        initWords();
    }, []);

    /**
     * Gets called after initialisation of the learning words, so that a first word is selected.
     */
    useEffect (() => {
        if (words != null) {
            getNextMorse();
        }
    }, [words]);

    /**
     * Gets called everytime the user enters a new letter, checks whether the input is equal to the given morse code.
     */
    useEffect (() => {
        setIsCorrect(morse != "" && textToMorse(textInput) === morse);
    }, [textInput]);

    /**
     * Gets called every time a new morse message to find is set.
     * Requests to play the new morse code.
     */
    useEffect (() => {
        playMorse();
    }, [morse]);

    /**
     * Initialises the useState which holds all learning words from the .josn file imported.
     */
    function initWords() {
        setWords(learnWords.words);
    }

    /**
     * Can only be called by the user when the correct word was entered.
     * Plays the morse code of the found word, resets the input and requests a new word to find.
     */
    function handleNextButton() {
        setTextInput("");
        getNextMorse();
    }

    /**
     * Uses the audio player to play the morse code of the found word.
     */
    async function playMorse() {
        player.seekTo(0);
        const uri = await encodeMorse(morse, "last_learnword")
        player.replace({uri: uri});
        player.play();
    }

    /**
     * Takes a random word of the learnword list and sets the corresponding useState.
     */
    function getNextMorse() {
        setMorse(textToMorse(words.at(Math.random() * words.length)));
    }

    return(
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, padding: 20, paddingTop: 30, gap: 20 }}>
            <BackArrowComponent></BackArrowComponent>
            <View style={styles.morse_box_container}>
                <Text style={styles.info_text}>Morse to Decode:</Text>
                <View style={styles.box_with_icon}>
                    <Text style={styles.morse_text}>{morse}</Text>
                    <Fontisto name="question" size={45} color={'black'} style={styles.icon}></Fontisto>
                </View>
            </View>
            <View style={styles.morse_box_container}>
                <Text style={styles.info_text}>Your Input:</Text>
                <View style={styles.box_with_icon}>
                    <Text style={styles.morse_text}>{textToMorse(textInput)}</Text>
                    {!isCorrect && <AntDesign name="closecircleo" size={45} color={'black'} style={styles.icon}></AntDesign>}
                    {isCorrect && <AntDesign name="checkcircleo" size={45} color={'black'} style={styles.icon}></AntDesign>}
                </View>
            </View>
            <TextInput style={styles.input} value={textInput} onChangeText={setTextInput} ></TextInput>
            <TouchableOpacity style={isCorrect ? styles.next_button : styles.next_button_disabled} disabled={!isCorrect} onPress={() => handleNextButton()}>
                <Text style={styles.next_button_text}>Next</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    morse_box_container: {
        flexDirection: 'column'
    },
    box_with_icon: {
        flexDirection: 'row',
        columnGap: 10
    },
    icon: {
        alignSelf: 'center'
    },
    info_text: {
        fontSize: 20,
        alignSelf: 'flex-start'
    },
    morse_text: {
        fontSize: 30,
        borderWidth: 3,
        width: "80%",
        alignSelf: 'center',
        backgroundColor: 'lightgray'
    },
    input: {
        fontSize: 30,
        borderBottomWidth: 3,
        width: "80%",
        alignSelf: 'flex-start'
    },
    next_button: {
        backgroundColor: "green",
        borderRadius: 10,
        padding: 15,
        width: "50%",
        alignSelf: 'center'
    },
    next_button_disabled: {
        backgroundColor: "lightgray",
        borderRadius: 10,
        padding: 15,
        width: "50%",
        alignSelf: 'center'
    },
    next_button_text: {
        fontSize: 20.0,
        textAlign: "center"
    }
})