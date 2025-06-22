// components/VideoFeedScreen.js - Infinite Scroll Feed
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
//import VideoItem from './VideoItem';
import { Video } from 'expo-av';

import { useVideo } from '../context/VideoContext';
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get('window');

const VideoFeedScreen = () => {
//  const { videos } = useVideo();



const { videos } = useVideo();

const mediaFeed = [...videos].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
    const navigation = useNavigation();

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

 /* const renderVideoItem = ({ item, index }) => (
    <VideoItem
      video={item}
      isActive={index === currentIndex}
      index={index}
    />
  );*/

  const getItemLayout = (data, index) => ({
    length: height,
    offset: height * index,
    index,
  });

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos yet</Text>
        <Text style={styles.emptySubtext}>Record your first video to get started!</Text>
        <TouchableOpacity style={styles.recordButton} onPress={() => navigation.navigate("VideoRecordingScreen")}>
          <Text style={styles.recordButtonText}>Record Video</Text>
        </TouchableOpacity>
      </View>
    );
  }




/*
const renderMediaItem = ({ item }) => {
  if (item.type === "photo") {
    return (
      <Image
        source={{ uri: item.localUri }}
        style={{ width: "100%", height: height }}
        resizeMode="cover"
      />
    );
  } else {
    return (
      <Video
        source={{ uri: item.localUri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={true}
        isLooping
        style={{ width: "100%", height: height }}
      />
    );
  }
};



*/

const renderMediaItem = ({ item }) => {
  const style = {
    width: "20%",
    height: height,
    marginBottom: 6,
  };
  const videoUri = item.cloudinaryUrl || item.localUri;

  return (
    <Video
      source={{ uri: videoUri }}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="cover"
      shouldPlay
      
      style={style}
    />
  );
};






  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("VideoRecordingScreen")}>
        <Text style={styles.backButtonText}>← Record</Text>
      </TouchableOpacity>

      <FlatList
data={mediaFeed}
    keyExtractor={(item) => item.id}
    renderItem={renderMediaItem}
    pagingEnabled
    getItemLayout={getItemLayout}

        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  recordButton: {
    backgroundColor: '#ff0050',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoFeedScreen;