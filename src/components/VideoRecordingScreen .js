import { CameraView, Camera,useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,Dimensions,Alert
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";

import { useVideo } from '../context/VideoContext';


const { width, height } = Dimensions.get('window');
const RECORD_TIME_LIMIT = 15000; // 15 seconds

export default function VideoRecordingScreen () {

 const [recordTime, setRecordTime] = useState(0);
   const cameraRef = useRef(null);
 const [isRecording, setIsRecording] = useState(false);
 const recordingTimer = useRef(null);






  const [cameraPermission, setCameraPermission] = useState(); //State variable for camera permission
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(); //State variable for media library permission
  const [micPermission, setMicPermission] = useState(); //// state variable for microphone permission
  const [cameraMode, setCameraMode] = useState("picture"); //State variable for picture or video. By default it will be for picture
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(); //After picture is taken this state will be updated with the picture
  const [video, setVideo] = useState(); //After video is recorded this state will be updated
  const [flashMode, setFlashMode] = useState("on"); //Camera Flash will be ON by default
  //const [recording, setRecording] = useState(false); //State will be true when the camera will be recording
  const [zoom, setZoom] = useState(0); //State to control the digital zoom
 // let cameraRef = useRef(); //Creates a ref object and assigns it to the variable cameraRef.
  const navigation = useNavigation();
 const { addVideo } = useVideo();
 const [permission, requestPermission] = useCameraPermissions()
  //When the screen is rendered initially the use effect hook will run and check if permission is granted to the app to access the Camera, Microphone and Media Library.
 /* useEffect(() => {
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



  */


   
  //Function to toggle between back and front camera
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  //Function to toggle flash on or off
  function toggleFlash() {
    setFlashMode((current) => (current === "on" ? "off" : "on"));
  }

  //Function to capture picture
  const takePic = async () => {
  if (!cameraRef.current) return;

  try {
    const options = {
      quality: 1,
      base64: false, // not needed unless you want to use it in memory
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);

    // ✅ Save to Media Library
    const asset = await MediaLibrary.createAssetAsync(newPhoto.uri);
    console.log("Photo saved:", asset.uri);

    // ✅ Optional: show feedback
    Alert.alert("Photo Saved", "Your photo has been saved to the media library.");

    // Clear photo preview if you don’t want to show it
    setPhoto(undefined);
  } catch (error) {
    console.error("Error taking/saving picture:", error);
    Alert.alert("Error", "Failed to capture or save the picture.");
  }
};


  //After the picture is captured it will be displayed to the user and the user will also be provided the option to save or discard the image
 /* if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.imageContainer}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <View style={styles.btnContainer}>
          {mediaLibraryPermission ? (
            <TouchableOpacity style={styles.btn} onPress={savePhoto}>
              <Ionicons name="save-outline" size={30} color="black" />
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setPhoto(undefined)}
          >
            <Ionicons name="trash-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
*/
  //Video Recorder
  /*
  async function recordVideo(){
    setRecording(true); //Updates the recording state to true. This will also toggle record button to stop button.
    cameraRef.current.recordAsync({ //cameraRef is a useRef hook pointing to the camera component. It provides access to the camera's methods, such as recordAsync. Starts recording a video and returns a Promise that resolves with the recorded video’s details.
      maxDuration: 30, //Limits the recording duration to 30 seconds. After 30 seconds, the recording automatically stops, and the Promise resolves.
    })
    .then((newVideo) => { //The result of this Promise is an object (newVideo) containing information about the recorded video, such as the file's URI and other metadata. This callback runs when the recording completes successfully. 
      setVideo(newVideo); // Stores the recorded video details in the state, which can later be used for playback, uploading, or other actions.
      setRecording(false);
    })
    console.log(video.uri)
  }






  function stopRecording(){
    setRecording(false);
    cameraRef.current.stopRecording();
    console.log("Recording stopped");
  }

  if(video) {
    let uri = video.uri;
    navigation.navigate("Video", {uri})
  }
  //We will design the camera UI first


*/









   useEffect(() => {
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
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
    };
  }, []);

  const recordVideo = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      setRecordTime(0);

      // Start timer
      recordingTimer.current = setInterval(() => {
        setRecordTime(prev => {
          const newTime = prev + 100;
          if (newTime >= RECORD_TIME_LIMIT) {
            stopRecording();
            return RECORD_TIME_LIMIT;
          }
          return newTime;
        });
      }, 100);

      const options = {
       // quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: 15,
        videoBitrate: 2000000,
      };

      const data = await cameraRef.current.recordAsync(options);
      console.log('Recording completed:', data);
      
      // Add video to context
      await addVideo(data);
      
      Alert.alert(
        'Video Recorded!',
        'Your video is being uploaded. You can view it in the feed.',
        [
          { text: 'Record Another', style: 'cancel' },
          //{ text: 'View Feed', onPress: onNavigateToFeed },
        ]
      );
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Recording Error', 'Failed to record video. Please try again.');
    }
  };




  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
    setIsRecording(false);
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
  };

  

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  
  return (
    <View style={styles.container}>
      
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        flash={flashMode}
        mode={cameraMode}
        zoom={zoom}
      >
        <Slider
          style={{ width: "100%", height: 40, position: "absolute", top: "75%" }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="cyan"
          maximumTrackTintColor="white"
          value={zoom}
          onValueChange={(value) => setZoom(value)}
        />
        <View style={styles.buttonContainer}>

           <TouchableOpacity style={styles.close} onPress={() => navigation.navigate("Home")}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCameraMode("picture")}
          >
            <Ionicons name="camera-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCameraMode("video")}
          >
            <Ionicons name="videocam-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
            <Text>
              {flashMode === "on" ? (
                <Ionicons name="flash-outline" size={20} color="white" />
              ) : (
                <Ionicons name="flash-off-outline" size={20} color="white" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shutterContainer}>
          {cameraMode === "picture" ? (
            <TouchableOpacity style={styles.button} onPress={takePic}>
              <Ionicons name="aperture-outline" size={40} color="white" />
            </TouchableOpacity>
          ) : isRecording ? (
            
            <TouchableOpacity style={styles.button} onPress={stopRecording}>
              <Ionicons name="stop-circle-outline" size={40} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={recordVideo}>
              <Ionicons name="play-circle-outline" size={40} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
  },
  shutterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  close:{
   marginTop:60,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
  imageContainer: {
    height: "95%",
    width: "100%",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    width: "auto",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  timerContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
  },
});