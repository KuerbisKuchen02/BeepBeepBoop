import React, { useState } from 'react';
import { Text, Button, View } from 'react-native';


// Background color based on boolean isSendByMe? or changing to color prop?
const MorseMessage = ({callsign, uri, text, morse, time, IsSendByMe})  => {

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
          <Text style={styles.callsign}>{callsign}</Text>
          <Text style={styles.messageText}>{text}</Text>
          <Text style={styles.messageMorse}>{morse}</Text>
        </View>
        <View style={styles.secondContainer}>
          <Button onPress={isPlaying ? stopReplayMessage : replayMessage} title="|>" style={isPlaying ? styles.stopReplayButton : styles.replayButton}></Button>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    borderWidth: 3,
    borderColor: 'darkgray',
    padding: 5,
    gap: 5,
  },
  messageBoxRetrieved: {
    alignSelf: 'felx-start',
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