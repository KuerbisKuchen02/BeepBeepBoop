import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 50 }}>
            <Image source={require('../assets/icon.png')} style={ styles.homeImage }/>
            <Text style= { styles.homeText }>Beep Beep Boop</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20, width: "100%" }}>
              <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/callsign')}>
                <Text style={styles.homeButtonText}>My callsign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/chat')}>
                <Text style={styles.homeButtonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/learn')}>
                <Text style={styles.homeButtonText}>Learn</Text>
              </TouchableOpacity>
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
  homeText: {
    fontSize: 30.0
  },
  homeImage: {
    width: "50%",
    height: "30%",
    resizeMode: 'contain',
  },
  homeButton: {
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 15,
    width: "50%"
  },
  homeButtonText: {
    fontSize: 20.0,
    textAlign: "center"
  }
})