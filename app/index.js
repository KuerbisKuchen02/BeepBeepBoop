import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles.js';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.home_view}>
            <Image source={require('../assets/icon.png')} style={ styles.homeImage }/>
            <View>
              <Text style= { styles.h1_text }>Beep Beep Boop</Text>
              <Text style={ styles.section_text }>Learn and talk via morse!</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20, width: "100%" }}>
              <TouchableOpacity style={[styles.homeButton, styles.button_body, styles.button_body_enabled]} onPress={() => router.push('/callsign')}>
                <Text style={[styles.button_text, styles.button_text_enabled]}>My callsign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.homeButton, styles.button_body, styles.button_body_enabled]} onPress={() => router.push('/chat')}>
                <Text style={[styles.button_text, styles.button_text_enabled]}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.homeButton, styles.button_body, styles.button_body_enabled]} onPress={() => router.push('/learn')}>
                <Text style={[styles.button_text, styles.button_text_enabled]}>Learn</Text>
              </TouchableOpacity>
            </View>
        </View>
  );
}