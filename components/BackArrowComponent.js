import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * A simple back button which navigates the user back to the last page when it gets clicked.
 * @returns 
 */
export default function BackArrowComponent() {
    const router = useRouter();

    return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {<Ionicons name="arrow-back-circle-outline" size={50} color="black" />}
        </TouchableOpacity>
    </View>
    )
}


const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start'
  },
  backButton: {
    alignItems: 'center',
  },
  arrowImage: {
    width: 100,
    height: 100,
  }
})