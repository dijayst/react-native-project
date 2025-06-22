



import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoverScreen from './src/screens/DiscoverScreen';
import InboxScreen from './src/screens/InboxScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { VideoProvider } from './src/context/VideoContext';


import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import VideoRecordingScreen from './src/components/VideoRecordingScreen ';
import VideoFeedScreen from './src/components/VideoFeedScreen';

const videos = new Array(5).fill(0).map((_, i) => ({
  id: i.toString(),
  title: `Video ${i + 1}`,
}));

 function HomeScreen() {
  return (
    <View style={styles.vidcontainer}>
   <VideoFeedScreen/>
    </View>
  );
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  vidcontainer: {

    backgroundColor: 'black',
  },
  title: {
    color: '#fff',
    fontSize: 28,
  },
});

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <VideoProvider> 
    <NavigationContainer>
      <Tab.Navigator screenOptions={{tabBarStyle:{backgroundColor:"black"}}}>
        <Tab.Screen name="Home" component={HomeScreen} options={{title:"home",tabBarIcon: ({color})=> <Ionicons name="home" size={26} color="white" />}} />
        <Tab.Screen name="Discover" component={DiscoverScreen} options={{title:"Discover",tabBarIcon: ({color})=> <Ionicons name="search" size={26} color="white" />}} />
        <Tab.Screen name="VideoRecordingScreen" component={VideoRecordingScreen} options={{title:"Upload",tabBarIcon: ({color})=> <Ionicons name="add-circle" size={26} color="white" />}} />
        <Tab.Screen name="Inbox" component={InboxScreen} options={{title:"Inbox",tabBarIcon: ({color})=> <Ionicons name="chatbubble-ellipses" size={26} color="white" />}} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{title:"Profile",tabBarIcon: ({color})=> <Ionicons name="person" size={26} color="white" />}} />
      </Tab.Navigator>
    </NavigationContainer>
    </VideoProvider> 
  );
}