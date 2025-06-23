import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router';
import { useState, useEffect} from 'react';

/**
 * 
 * @returns 
 */
export default function BackArrowComponent() {
    const router = useRouter();

    const [dimensions, setDimensions] = useState({width: 1, height: 1});

    useEffect(() => {
      const { width, height } = Image.resolveAssetSource(require('../assets/back-arrow.png'));
      setDimensions({
        width: width * 0.15,
        height: height * 0.15,
      });
    }, []);

    return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Image source={require('../assets/back-arrow.png')} 
            style={{ width: dimensions.width, height: dimensions.height }}
            resizeMode="contain"/>
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