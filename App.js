import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import ChatComponent from './components/ChatComponent.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputComponent from './components/InputComponent.js';

export default function App() {
  "use strict";

  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eeeeee', padding: 20 }}>

            <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
              <ChatComponent />
            </View>
            <InputComponent />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}