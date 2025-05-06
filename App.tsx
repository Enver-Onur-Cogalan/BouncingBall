import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DragAndThrowBall from './src/DragAndThrowBall';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#111' }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <DragAndThrowBall />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App;
