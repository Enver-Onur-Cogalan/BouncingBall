import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { height } = Dimensions.get('window');

export default function App() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: height * 0.6,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: height * 0.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: height * 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: height * 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY]);


  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.ball, { transform: [{ translateY }] }]} />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'greenyellow',
    marginTop: 50,
  },
});
