import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { Audio } from 'expo-av';
import { useAudioRecorder, RecordingConfig } from '@siteed/expo-audio-studio'
import { encodeMorse, decodeMorse, textToMorse, playUri } from './morse_util.js';
import * as Sharing from 'expo-sharing';
import ChatComponent from './components/ChatComponent.js';

export default function App() {
  "use strict";
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
    const { granted } = await Audio.requestPermissionsAsync()
    if (granted) {
      const config = {
        interval: 500, // Emit recording data every 500ms
        enableProcessing: false, // Enable audio analysis
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
          // console.log(`onAudioAnalysis`, analysisEvent)
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

  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eeeeee', padding: 20 }}>

      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
        <ChatComponent />
      </View>

      <View style={{ paddingTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <TextInput
            placeholder="Enter text to encode in Morse"
            onChangeText={setEncodeText}
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <Button title='Encode and Play' onPress={handleEncodeMorse} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Button title="Request Permission" onPress={() => Audio.requestPermissionsAsync()} />
          {isRecording ? (
            <View>
              <Text>Duration: {durationMs / 1000} seconds</Text>
              <Text>Size: {size} bytes</Text>
              <Button title="Pause Recording" onPress={pauseRecording} />
              <Button title="Stop Recording" onPress={handleStop} />
            </View>
          ) : isPaused ? (
            <View>
              <Text>Duration: {durationMs / 1000} seconds (Paused)</Text>
              <Text>Size: {size} bytes</Text>
              <Button title="Resume Recording" onPress={resumeRecording} />
              <Button title="Stop Recording" onPress={handleStop} />
            </View>
          ) : (
            <View>
              <Button title="Start Recording" onPress={handleStart} />
            </View>
          )}
        </View>
      </View>

    </View>
  );
}