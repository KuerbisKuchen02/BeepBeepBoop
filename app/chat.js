import {
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import ChatComponent from '../components/ChatComponent.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Chat() {
  "use strict";

  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ChatComponent />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}