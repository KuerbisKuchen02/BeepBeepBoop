import { KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, Platform} from 'react-native';
import { useState, useEffect } from 'react';
import { useAudioPlayer } from "expo-audio";
import BackArrowComponent from '../components/BackArrowComponent';
import { textToMorse, encodeMorse } from '../morse_util';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import learnWords from '../assets/data/learnwords.json';
import styles from '../styles.js';

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
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.page_view}>
            <BackArrowComponent></BackArrowComponent>
            <View>
                <Text style={styles.learn_info_text}>Morse to Decode:</Text>
                <View style={styles.learn_box_with_icon}>
                    <Text style={styles.learn_morse_text}>{morse}</Text>
                    <Fontisto name="question" size={45} color={'black'}></Fontisto>
                </View>
            </View>
            <View>
                <Text style={styles.learn_info_text}>Your Input:</Text>
                <View style={styles.learn_box_with_icon}>
                    <Text style={styles.learn_morse_text}>{textToMorse(textInput)}</Text>
                    {!isCorrect && <AntDesign name="closecircleo" size={45} color={'black'} ></AntDesign>}
                    {isCorrect && <AntDesign name="checkcircleo" size={45} color={'black'} ></AntDesign>}
                </View>
            </View>
            <TextInput style={styles.learn_text_input} value={textInput} onChangeText={setTextInput} ></TextInput>
            <TouchableOpacity style={[styles.button_body, isCorrect ? styles.button_body_enabled : styles.button_body_disabled]} disabled={!isCorrect} onPress={() => handleNextButton()}>
                <Text style={[styles.button_text, isCorrect ? styles.button_text_enabled : styles.button_text_disabled]}>Next</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}