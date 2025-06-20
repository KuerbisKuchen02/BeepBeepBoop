import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home Screen</Text>
            <Button title="Go to Input" onPress={() => router.push('/callsign')} />
            <Button title="Go to Chat" onPress={() => router.push('/chat')} />
        </View>
  );
}