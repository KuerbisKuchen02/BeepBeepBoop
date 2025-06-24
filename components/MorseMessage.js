import { Text, TouchableOpacity, View } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import styles from '../styles.js';

/**
 * Parameters for the MorseMessage Component.
 * @param {int} id: Identificator of the message, used for identifiying Filesystem URI
 * @param {String} callsign: Callsign of the Sender, only when isSendByMe == false
 * @param {String} uri: Filepath to the .wav file
 * @param {String} text: Text of the message to display
 * @param {String} morse: Message as Morse Code, only containing '.' and '-'
 * @param {String} time: Time when message was send / recieved in format HH:MM
 * @param {boolean} isSendByMe: Whether the Message was send (true) or recieved (false)
 * @param {function} handleButtonClick: function which will be executed when the button of the message is clicked.
 * @param {boolean} isPlaying: Whether the audioplayer of the parent component is currently playing the corresponding .wav file. 
 * @param {boolean} isLoading: Whether the .wav file located in the uri path is currently being created.
 */
export default function MorseMessage({ id, callsign, uri, text, morse, time, isSendByMe, handleButtonClick, isPlaying, isLoading}) {

  const IconButton = ({ icon, onPress }) => {
    return <TouchableOpacity onPress={onPress}>
      {icon}
    </TouchableOpacity>
  }

  return (
    <View>
      <View style={isSendByMe ? styles.messagebox : [styles.messagebox, styles.messagebox_retrieved]}>
        <View style={styles.message_main_container}>
          <Text style={styles.message_callsign}>{callsign}</Text>
          <Text style={styles.message_text}>{text}</Text>
          <Text style={styles.message_morse}>{morse}</Text>
        </View>
        <View style={styles.message_second_container}>
          {isLoading ? (
            <IconButton icon={<Fontisto name="spinner-rotate-forward" size={15} color="black" />} />
          ) : (
            uri == null ? (
              <IconButton icon={<Fontisto name="download" size={15} color="black" />} onPress={() => handleButtonClick(id)} />
            ) : (
              isPlaying ? (
                <IconButton icon={<Fontisto name="stop" size={15} color="black" />} onPress={() => handleButtonClick(id)} />
              ) : (
                <IconButton icon={<Fontisto name="play" size={15} color="black" />} onPress={() => handleButtonClick(id)} />
              )
            )
          )}
          <Text style={styles.message_time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};