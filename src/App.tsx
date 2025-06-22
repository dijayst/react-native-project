/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 

import { StatusBar, StyleSheet, useColorScheme, View,Text } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>tfytrruyy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"red",
  },
});

export default App;
*/


// src/App.tsx
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';


import { useChatStore } from './store/chatStore';
import ChatList from './components/ChatList/ChatList';

// In production, these should be loaded from secure environment variables
const ABLY_API_KEY = '5Vlytg.mBxa-Q:Sq_0kJPu1_c6PIV9uOjb29dlqqSO3eOH92eDUpsxqAc';
const CHANNEL_NAME = 'secure-chat-channel';

const App: React.FC = () => {
  const { initializeChat } = useChatStore();

  useEffect(() => {
    // Initialize chat on app start
    const initApp = async () => {
      try {
        await initializeChat(ABLY_API_KEY, CHANNEL_NAME);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, [initializeChat]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ChatList/>

      
    </SafeAreaProvider>
  );
};




export default App;