import { KeyboardAvoidingView, Platform } from 'react-native';
import ChatComponent from '../components/ChatComponent.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from '../styles.js'

export default function Chat() {
  "use strict";

  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chat_container}>
          <ChatComponent />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}