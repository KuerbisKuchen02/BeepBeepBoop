import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useAudioPlayer} from 'expo-audio';
import { encodeMorse, decodeMorse } from './morse_util.js';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';

import * as Sharing from 'expo-sharing';

export default function App() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [uri, setUri] = useState(null);
  const player = useAudioPlayer(uri);

  useEffect(() => {
    console.log("Generating Morse code for SOS");
    encodeMorse("Hallo Welt!").then((u) => {
      console.log("Morse code URI:", u);
      setUri(u);
    });
  }, []);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    setIsRecording(false);
    setUri(audioRecorder.uri);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  useEffect(() => {
    if (!uri) return;
    console.log("Decoding Morse code from URI:", uri);
    decodeMorse(uri).then((text) => {
      console.log("Decoded Morse text:", text);
    });
  }, [uri])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Morse: SOS</Text>
      <Button title="Play Morse" onPress={() => {console.log("Starte Morse code"); player.play();}} disabled={!uri} />
      <Button title="Pause" onPress={player.pause} disabled={!uri} />
      <Button title="Stop" onPress={player.stop} disabled={!uri} />
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : record}
      />
    </View>
  );
}
