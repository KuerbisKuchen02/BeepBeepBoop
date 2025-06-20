import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {useState} from 'react';

export default function Callsign() {

  const [callsign, setCallsign] = useState([]);
  const checkInput = () => {
    console.log("1: " + callsign[0]);
    console.log("2: " + callsign[1]);
    console.log("3: " + callsign[2]);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={styles.headText}>Callsign</Text>
        <View style={styles.inputBoxContainer}>
          <TextInput style={styles.inputBox} value={callsign[0]} maxLength={1} onChange={checkInput}></TextInput>
          <TextInput style={styles.inputBox} value={callsign[1]} maxLength={1} onChange={checkInput}></TextInput>
          <TextInput style={styles.inputBox} value={callsign[2]} maxLength={1} onChange={checkInput}></TextInput>
        </View>
      <Text style={styles.descriptionText}>Enter a 3 character sequence to identify yourself in chats</Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headText: {
    fontSize: 30.0,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 20.0,
    textAlign: "center",
  },
  inputBoxContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    gap: 20,
    maxheight: 10,
  },
  inputBox: {
    fontSize: 18,
    fontStyle: 'bold',
    borderBlockColor: 'black',
    borderWidth: 5,
    textAlign: 'center',
    minWidth: '10%',
  }
});