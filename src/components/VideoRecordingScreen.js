import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'

export default function VideoRecordingScreen() {
  return (
    <View style={styles.container}>
      <Text>VideoRecordingScreen</Text>
    </View>
  )
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
