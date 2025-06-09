import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useAudioPlayer} from 'expo-audio';
import { encodeMorse } from './morse_util.js';

import * as Sharing from 'expo-sharing';


async function shareWavFile(uri) {
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(uri);
  } else {
    console.log("Sharing nicht verfügbar");
  }
}

export default function App() {
  const [uri, setUri] = useState(null);
  const player = useAudioPlayer(uri);

  useEffect(() => {
    console.log("Generating Morse code for SOS");
    encodeMorse("Hallo Welt!").then((u) => {
      setUri(u);
      console.log("Morse code URI:", u);
    });
  }, []);

  useEffect(() => {
    shareWavFile(uri);
  }, [uri])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Morse: SOS</Text>
      <Button title="Play Morse" onPress={() => {console.log("Starte Morse code"); player.play();}} disabled={!uri} />
      <Button title="Pause" onPress={player.pause} disabled={!uri} />
      <Button title="Stop" onPress={player.stop} disabled={!uri} />
    </View>
  );
}
