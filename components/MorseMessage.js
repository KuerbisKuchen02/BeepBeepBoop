import React, { useState } from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { encodeMorse, playUri, textToMorse } from '../morse_util';

/**
 * Parameters for the MorseMessage Component.
 * Integer id: Identificator of the message, used for identifiying Filesystem URI
 * String callsign: Callsign of the Sender, only when isSendByMe == false
 * String uri: Filepath to the .wav file
 * String text: Text of the message to display
 * String morse: Message as Morse Code, only containing '.' and '-'
 * String time: Time when message was send / recieved in format HH:MM
 * Boolean: isSendByMe: Whether the Message was send (true) or recieved (false)
 */
const MorseMessage = ({id, callsign, uri, text, morse, time, isSendByMe})  => {

const [isPlaying, setIsPlaying] = useState(false);
const [currUri, setCurrUri] = useState(uri);

/**
 * Try's to validate the uri path, if invalid try's create a Uri from other data from message.
 * If the path (uri) isn't valid, a uri will be created from the morse of the message.
 * If the morse is null, a morse will be created from the text of the message.
 * If the text is also null no uri can be created.
 * Returns true when path existed, otherwise returns false.
 * @returns boolean
 */
const validateUri = async () => {
  // Check wheter the uri is available and valid
  try {
    let fileSystemInfo = {exists: false};
    if (currUri != null) {
      fileSystemInfo = await FileSystem.getInfoAsync(currUri);
    }
    
    if (!fileSystemInfo.exists) {
      console.warn("Uri Path is invalid, try to create uri via morse data")
      if(morse == null) {
        console.warn("Morse data isn't available, trying to create morse via text data")
        if (text == null) {
          console.error("Error while trying to create Uri. No data to create Uri from!");
          return false;
        }
        morse = await textToMorse(text);
      }
      // Update Uri
      setCurrUri(await encodeMorse(morse, "message_" + id));
      return false;
    } 
  } catch (error) {
    console.error("Error while trying to create Uri from other data!");
    console.error(error);
  }

  return true;
}

const replayMessage = async () => {
  if (await validateUri()) {
    // Update UI and play Sound
    setIsPlaying(true);
    const avPlayBackStatus = await playUri(currUri);
    //console.log(avPlayBackStatus);       --> Need to update UI based on this return... maybe in seperate Thread?
    setIsPlaying(false);
  }
}

const stopReplayMessage = () => {
  setIsPlaying(false);
}

return (
    <View>
      <View style={isSendByMe ? styles.messageBox : [styles.messageBox, styles.messageBoxRetrieved]}>
        <View style={styles.mainContainer}>
          {!isSendByMe && <Text style={styles.callsign}>{callsign}</Text>}
          <Text style={styles.messageText}>{text}</Text>
          <Text style={styles.messageMorse}>{morse}</Text>
        </View>
        <View style={styles.secondContainer}>
          <Button onPress={currUri == null ? validateUri : isPlaying ? stopReplayMessage : replayMessage} title={currUri == null ? "!" : isPlaying ? "||" : "|>"} style={isPlaying ? styles.stopReplayButton : styles.replayButton}></Button>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    borderRadius: 25,
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    borderWidth: 3,
    borderColor: 'darkgray',
    padding: 10,
    gap: 5,
  },
  messageBoxRetrieved: {
    alignSelf: 'flex-start',
    backgroundColor: 'mintcream',
  },
  mainContainer: {
    flex: 5,
    gap: 2
  },
  secondContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  callsign: {
    fontSize: 10,
    fontWeight: 'bold',
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
  },
  messageText : {
    
  },
  messageMorse : {
    fontSize:18,
  },
  replayButton : {

  },
  stopReplayButton : {

  },
  time : {
    alignSelf: 'flex-end'
  }
});

export default MorseMessage;