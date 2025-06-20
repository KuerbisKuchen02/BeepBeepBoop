import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import ChatComponent from '../components/ChatComponent.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputComponent from '../components/InputComponent.js';

export default function Chat() {
  "use strict";

  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eeeeee', padding: 20 }}>
            <ChatComponent />
            <InputComponent />
          </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}