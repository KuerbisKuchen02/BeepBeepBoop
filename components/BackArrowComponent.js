import { View, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * A simple back button which navigates the user back to the last page when it gets clicked.
 * @returns 
 */
export default function BackArrowComponent() {
    const router = useRouter();

    return (
    <View>
        <TouchableOpacity onPress={() => router.back()}>
          {<Ionicons name="arrow-back-circle-outline" size={50} color="black" />}
        </TouchableOpacity>
    </View>
    )
}