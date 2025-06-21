
import VideoRecordingScreen from './src/components/VideoRecordingScreen';

import VideoFeedScreen from './src/components/VideoFeedScreen';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
//import Notes from "./components/Notes/NotesScreen";
//import AddNote from "./components/Notes/AddNote";
//import ViewNote from "./components/Notes/ViewNote";
//import VideoScreen from './components/Camera/Video';




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
         style={{ textAlign: "center", color: "red" }}
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
         style={{ textAlign: "center", color: "red" }}
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
export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
       <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="VideoRecordingScreen" component={VideoRecordingScreen}/>
       
       <Stack.Screen name="VideoFeedScreen" component={VideoFeedScreen}/>
     </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
