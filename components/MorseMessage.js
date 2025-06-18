import React, { useState } from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';


/**
 * Parameters for the MorseMessage Component.
 * String callsign: Callsign of the Sender, only when isSendByMe == false
 * String uri: Filepath to the .wav file
 * String text: Text of the message to display
 * String morse: Message as Morse Code, only containing '.' and '-'
 * String time: Time when message was send / recieved in format HH:MM
 * Boolean: isSendByMe: Whether the Message was send (true) or recieved (false)
 */
const MorseMessage = ({callsign, uri, text, morse, time, isSendByMe})  => {

const [isPlaying, setIsPlaying] = useState(false);

const replayMessage = () => {
  setIsPlaying(true);
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
          <Button onPress={isPlaying ? stopReplayMessage : replayMessage} title={isPlaying ? "||" : "|>"} style={isPlaying ? styles.stopReplayButton : styles.replayButton}></Button>
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