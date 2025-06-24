import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';

import Snackbar from 'react-native-snackbar';
import { useAudioRecorder, ExpoAudioStreamModule } from '@siteed/expo-audio-studio'
import { AudioVisualizer } from '@siteed/expo-audio-ui';

import { decodeMorse, textToMorse } from '../morse_util.js';

/**
 * Parameters for the MorseMessage Component.
 * @param {Function} addMessage - Function to handle sending a message.
 * @description Component which handles text input and audio recording for Morse code messages.
 */

export default function InputComponent({ addMessage }) {
    const [encodeText, setEncodeText] = useState('');

    const {
        startRecording,
        stopRecording,
        resumeRecording,
        isRecording,
        isPaused,
        durationMs,
        size,
        analysisData,
    } = useAudioRecorder({
        logger: console,
    })


    /**
     * Handles the encoding of text to Morse code and sends the message.
     * @returns {Promise<void>}
     */
    const handleEncodeMorse = async () => {
        try {
            if (encodeText.length === 0) { return; }
            const morse = await textToMorse(encodeText);
            addMessage(encodeText.trim().toUpperCase(), morse, "", null, true, true);
            setEncodeText("");
        } catch (error) {
            console.error('InputComponent:handleEncodeMorse: ', error);
        }
    }

    /**
     * First, requests permission to access the microphone. Then, starts the audio recording with a specified configuration.
     * @returns {Promise<void>}
     */
    const handleStart = async () => {
        const { status } = await ExpoAudioStreamModule.requestPermissionsAsync();
        if (status !== 'granted') {
            console.error('InputComponent:handleStart: Permission to access microphone was denied');
            return;
        }
        const config = {
            interval: 500, // Emit recording data every 500ms
            enableProcessing: true, // Enable audio analysis
            sampleRate: 44100, // Sample rate in Hz (16000, 44100, or 48000)
            channels: 1, // Mono recording
            encoding: 'pcm_16bit', // PCM encoding (pcm_8bit, pcm_16bit, pcm_32bit)

            // Handle recording interruptions
            onRecordingInterrupted: (event) => {
                console.log(`InputComponent:handleStart: Recording interrupted: ${event.reason}`);
            },

            autoResumeAfterInterruption: false  // Auto-resume after interruption
        }

        await startRecording(config)
    }

    /**
     * Handles stopping the audio recording and decoding the Morse code from the recording.
     * Displays a Snackbar message if no Morse code or text is decoded.
     * @returns {Promise<void>}
     */
    const handleStop = async () => {
        const recording = await stopRecording();
        console.log(`InputComponent:handleStop: Recording saved: ${recording.fileUri}`);
        decodeMorse(recording.fileUri).then(({ text, morse }) => {
            if (text == "" && morse == "") {
                console.warn("InputComponent:handleStop: No Morse code or text decoded from recording.");
                Snackbar.show({
                    text: 'ERROR: No Morse code or text decoded from recording.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                });
                return;
            }
            addMessage(text, morse, "", recording.fileUri);
        });
    }

    const IconButton = ({ title, onPress, icon, border }) => (
        <TouchableOpacity onPress={onPress} style={border ? [styles.button, styles.border_button] : styles.button}>
            <Text>{title}</Text>
            {icon}
        </TouchableOpacity>
    );

    return (
        <View style={{ paddingTop: 10 }}>
            {isRecording ? (
                <View>
                    <AudioVisualizer
                        audioData={analysisData ?? { amplitudeRange: {}, dataPoints: [] }}
                        canvasHeight={70}
                        candleWidth={2}
                        candleSpace={1}
                        showRuler={true}
                        showNavigation={false}
                        amplitudeScaling="normalized"
                    />
                    <Text>Duration: {durationMs / 1000} seconds</Text>
                    <Text>Size: {size} bytes</Text>
                    <View flexDirection="row" justifyContent="center" alignItems="center" gap={10} margin={10}>
                        <IconButton icon={<Fontisto name="stop" size={30} color="black" />} onPress={handleStop} border={true} />
                    </View>
                </View>
            ) : isPaused ? (
                <View>
                    <AudioVisualizer
                        audioData={analysisData ?? { amplitudeRange: {}, dataPoints: [] }}
                        canvasHeight={100}
                        candleWidth={2}
                        candleSpace={1}
                        showRuler={true}
                        showNavigation={false}
                        amplitudeScaling="normalized"
                    />
                    <Text>Duration: {durationMs / 1000} seconds</Text>
                    <IconButton icon={<Fontisto name="play" size={24} color="black" />} onPress={resumeRecording} />
                    <IconButton icon={<Fontisto name="stop" size={24} color="black" />} onPress={handleStop} />
                </View>
            ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <TextInput
                        placeholder="Enter text to encode in Morse"
                        value={encodeText}
                        onChangeText={setEncodeText}
                        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
                    />

                    <IconButton icon={<Fontisto name="mic" size={24} color="black" />} onPress={handleStart} />
                    <IconButton
                        onPress={handleEncodeMorse}
                        icon={<Ionicons name="send" size={24} color="black" />}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    border_button: {
        borderWidth: 3,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 50
    },
})