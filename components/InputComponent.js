import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

import * as Sharing from 'expo-sharing';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';

import { useAudioRecorder, ExpoAudioStreamModule } from '@siteed/expo-audio-studio'
import { AudioVisualizer } from '@siteed/expo-audio-ui';

import {
    encodeMorse,
    decodeMorse,
    textToMorse,
    playUri
} from '../morse_util.js';

export default function InputComponent({ }) {
    const [encodeText, setEncodeText] = useState('');

    const {
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        isRecording,
        isPaused,
        durationMs,
        size,
        analysisData,
        compression,
    } = useAudioRecorder({
        logger: console,
    })

    const handleEncodeMorse = async () => {
        try {
            const morse = await textToMorse(encodeText);
            const uri = await encodeMorse(morse, "default");
            await playUri(uri);
        } catch (error) {
            console.error('Error converting to morse:', error);
        }
    }

    const handleStart = async () => {
        const { status } = await ExpoAudioStreamModule.requestPermissionsAsync()
        if (status !== 'granted') {
            console.error('Permission to access microphone was denied');
            return;
        }
        const config = {
            interval: 500, // Emit recording data every 500ms
            enableProcessing: true, // Enable audio analysis
            sampleRate: 44100, // Sample rate in Hz (16000, 44100, or 48000)
            channels: 1, // Mono recording
            encoding: 'pcm_16bit', // PCM encoding (pcm_8bit, pcm_16bit, pcm_32bit)

            // Optional: Configure audio compression
            compression: {
                enabled: false, // Set to true to enable compression
                format: 'aac', // 'aac' or 'opus'
                bitrate: 16000, // Bitrate in bits per second
            },

            // Optional: Handle audio stream data
            onAudioStream: async (audioData) => {
                // console.log(`onAudioStream`, audioData)
            },

            // Optional: Handle audio analysis data
            onAudioAnalysis: async (analysisEvent) => {
            },

            // Optional: Handle recording interruptions
            onRecordingInterrupted: (event) => {
                console.log(`Recording interrupted: ${event.reason}`)
            },

            // Optional: Auto-resume after interruption
            autoResumeAfterInterruption: false,
        }

        await startRecording(config)
    }

    const handleStop = async () => {
        const recording = await stopRecording()
        console.log('Recording saved:', recording.fileUri)
        decodeMorse(recording.fileUri).then((text) => {
            console.log("Decoded Morse text:", text);
            shareWavFile(recording.fileUri);
        });
    }

    async function shareWavFile(uri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(uri);
        } else {
            console.log("Sharing nicht verfügbar");
        }
    }

    const IconButton = ({ title, onPress, icon, border }) => (
        <TouchableOpacity onPress={onPress}
            style={border ? [styles.button, styles.border_button] : styles.button}
        >
            <Text>{title}</Text>
            {icon}
        </TouchableOpacity>
    );

    return (
        <View style={{ paddingTop: 10}}>
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
                        {/* <IconButton icon={<Fontisto name="pause" size={30} color="black" />} onPress={pauseRecording} /> */}
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
                    <Text>Size: {size} bytes</Text>
                    <IconButton icon={<Fontisto name="play" size={24} color="black" />} onPress={resumeRecording} />
                    <IconButton icon={<Fontisto name="stop" size={24} color="black" />} onPress={handleStop} />
                </View>
            ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <TextInput
                        placeholder="Enter text to encode in Morse"
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