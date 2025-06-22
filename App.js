/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import VideoRecordingScreen from './src/components/VideoRecordingScreen ';

import { VideoProvider } from './src/context/VideoContext';
import VideoFeedScreen from './src/components/VideoFeedScreen';

function HomeScreen({ navigation }) {  
  return (
   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
     <TouchableOpacity
       style={{
         width: "80%",
         padding: 5,
         borderColor: "red",
         borderWidth: 1,
         borderRadius: 15,
         marginVertical: 10
       }}
     >
       <Text
         style={{ textAlign: "center", color: "red" }}
         onPress={() =>
           navigation.navigate("NotesScreen")
         }
       >
         Notes
       </Text>
     </TouchableOpacity>
     <TouchableOpacity
       style={{
         width: "80%",
         padding: 5,
         borderColor: "red",
         borderWidth: 1,
         borderRadius: 15,
         marginVertical: 10
       }}
     >
       <Text
         style={{ textAlign: "center", color: "#000000" }}
         onPress={() =>
           navigation.navigate("VideoRecordingScreen")
         }
       >
         Camera
       </Text>
     </TouchableOpacity>
     <TouchableOpacity
       style={{
         width: "80%",
         padding: 5,
         borderColor: "red",
         borderWidth: 1,
         borderRadius: 15,
         marginVertical: 10
       }}
     >
       <Text
         style={{ textAlign: "center", color: "blue" }}
         onPress={() =>
           navigation.navigate("VideoFeedScreen")
         }
       >
         Video
       </Text>
     </TouchableOpacity>
   </View>
 );
}

const Stack = createNativeStackNavigator();

function App() {
 return (
   <VideoProvider> 
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="VideoRecordingScreen" component={VideoRecordingScreen} />
          <Stack.Screen name="VideoFeedScreen" component={VideoFeedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </VideoProvider>
 );
}

export default App;*/




// App.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

const dummyVideos = [
  { id: '1', user: 'user1', caption: 'Cool dance moves!', song: 'Song by Artist', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', user: 'user2', caption: 'Funny skit!', song: 'Another Song', avatar: 'https://i.pravatar.cc/150?img=2' },
];

export default function App() {
  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.placeholderText}>Video Placeholder</Text>
      </View>

      <View style={styles.rightBar}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.iconWrapper}>
          <FontAwesome name="heart" size={28} color="white" />
          <Text style={styles.iconText}>123</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <FontAwesome name="comment" size={28} color="white" />
          <Text style={styles.iconText}>45</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Ionicons name="share-social" size={28} color="white" />
          <Text style={styles.iconText}>9</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.username}>@{item.user}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.song}>{item.song}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dummyVideos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomTabs}>
        <Ionicons name="home" size={26} color="white" />
        <Ionicons name="search" size={26} color="white" />
        <Ionicons name="add-circle" size={32} color="white" />
        <Ionicons name="chatbubble-ellipses" size={26} color="white" />
        <Ionicons name="person" size={26} color="white" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height,
    width,
    justifyContent: 'flex-end',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 22,
  },
  rightBar: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  iconText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  bottomBar: {
    paddingHorizontal: 12,
    marginBottom: 80,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
  },
  caption: {
    color: '#fff',
    marginTop: 4,
  },
  song: {
    color: '#ccc',
    marginTop: 2,
    fontSize: 12,
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});