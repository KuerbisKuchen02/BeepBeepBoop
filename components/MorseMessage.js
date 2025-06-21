import React, { useState, useEffect, use } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { encodeMorse, playUri, textToMorse } from '../morse_util';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'

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
const MorseMessage = ({ id, callsign, uri, text, morse, time, isSendByMe, handleButtonClick, isPlaying, isLoading}) => {

  const IconButton = ({ icon, onPress }) => {
    return <TouchableOpacity onPress={onPress}>
      {icon}
    </TouchableOpacity>
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
          {isLoading ? (
            <IconButton icon={<Fontisto name="spinner-rotate-forward" size={15} color="black" />} />
          ) : (
            uri == null ? (
              <IconButton icon={<Fontisto name="download" size={15} color="black" />} onPress={() => handleButtonClick(id, uri)} />
            ) : (
              isPlaying ? (
                <IconButton icon={<Fontisto name="stop" size={15} color="black" />} onPress={() => handleButtonClick(id, uri)} />
              ) : (
                <IconButton icon={<Fontisto name="play" size={15} color="black" />} onPress={() => handleButtonClick(id, uri)} />
              )
            )
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callsign: {
    fontSize: 10,
    fontWeight: 'bold',
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
  },
  messageText: {

  },
  messageMorse: {
    fontSize: 18,
  },
  replayButton: {

  },
  stopReplayButton: {

  },
  time: {
    alignSelf: 'flex-end'
  }
});

export default MorseMessage;