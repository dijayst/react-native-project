import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";


export default function VideoRecordingScreen() {



    const [cameraPermission, setCameraPermission] = useState(); //State variable for camera permission
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(); //State variable for media library permission
  const [micPermission, setMicPermission] = useState(); //// state variable for microphone permission
  const [cameraMode, setCameraMode] = useState("picture"); //State variable for picture or video. By default it will be for picture
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(); //After picture is taken this state will be updated with the picture
  const [video, setVideo] = useState(); //After video is recorded this state will be updated
  const [flashMode, setFlashMode] = useState("on"); //Camera Flash will be ON by default
  const [recording, setRecording] = useState(false); //State will be true when the camera will be recording
  const [zoom, setZoom] = useState(0); //State to control the digital zoom
  let cameraRef = useRef(); //Creates a ref object and assigns it to the variable cameraRef.
  const navigation = useNavigation();



 useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      setCameraPermission(cameraPermission.status === "granted");
      setMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setMicPermission(microphonePermission.status === "granted");
    })();
  }, []);

  //If permissions are not granted app will have to wait for permissions
  if (
    cameraPermission === undefined ||
    mediaLibraryPermission === undefined ||
    micPermission === undefined
  ) {
    return <Text>Request Permissions....</Text>;
  } else if (!cameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings
      </Text>
    );
  }

  //Function to toggle between back and front camera
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }



  

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
