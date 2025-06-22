/*/ context/VideoContext.js - Global Video State Management
import React, { createContext, useContext, useReducer, useCallback } from 'react';
//import { uploadVideoToCloudinary } from '../services/cloudinaryService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VideoContext = createContext();

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_VIDEO':
      return {
        ...state,
        videos: [action.payload, ...state.videos],
      };
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video =>
          video.id === action.payload.id ? { ...video, ...action.payload } : video
        ),
      };
    case 'SET_VIDEOS':
      return {
        ...state,
        videos: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, {
    videos: [],
    loading: false,
  });

  const addVideo = useCallback(async (videoData) => {
    const newVideo = {
      id: Date.now().toString(),
      localUri: videoData.uri,
      duration: videoData.duration || 15,
      createdAt: new Date().toISOString(),
      status: 'uploading',
      uploadProgress: 0,
      retryCount: 0,
    };

    dispatch({ type: 'ADD_VIDEO', payload: newVideo });
    await saveVideosToStorage([newVideo, ...state.videos]);

    // Start upload process
    uploadVideo(newVideo);
  }, [state.videos]);

  const uploadVideo = async (video) => {
    try {
      const result = await uploadVideoToCloudinary(video.localUri, (progress) => {
        dispatch({
          type: 'UPDATE_VIDEO',
          payload: { id: video.id, uploadProgress: progress },
        });
      });

      dispatch({
        type: 'UPDATE_VIDEO',
        payload: {
          id: video.id,
          status: 'uploaded',
          hlsUrl: result.secure_url,
          cloudinaryId: result.public_id,
          uploadProgress: 100,
        },
      });

      await saveVideosToStorage(state.videos);
    } catch (error) {
      console.error('Upload failed:', error);
      dispatch({
        type: 'UPDATE_VIDEO',
        payload: {
          id: video.id,
          status: 'error',
          error: error.message,
          retryCount: video.retryCount + 1,
        },
      });
    }
  };

  const retryUpload = useCallback((video) => {
    if (video.retryCount < 3) {
      dispatch({
        type: 'UPDATE_VIDEO',
        payload: { id: video.id, status: 'uploading', uploadProgress: 0 },
      });
      uploadVideo(video);
    }
  }, []);

  const saveVideosToStorage = async (videos) => {
    try {
      await AsyncStorage.setItem('savedVideos', JSON.stringify(videos));
    } catch (error) {
      console.error('Failed to save videos:', error);
    }
  };

  const loadVideosFromStorage = useCallback(async () => {
    try {
      const savedVideos = await AsyncStorage.getItem('savedVideos');
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        dispatch({ type: 'SET_VIDEOS', payload: videos });
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  }, []);

  React.useEffect(() => {
    loadVideosFromStorage();
  }, [loadVideosFromStorage]);

  return (
    <VideoContext.Provider
      value={{
        videos: state.videos,
        loading: state.loading,
        addVideo,
        retryUpload,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within VideoProvider');
  }
  return context;
};*/




import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { uploadVideoToCloudinary } from '../services/cloudinaryService';

import * as MediaLibrary from 'expo-media-library';

const VideoContext = createContext();

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_VIDEO':
      return {
        ...state,
        videos: [action.payload, ...state.videos],
      };
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video =>
          video.id === action.payload.id ? { ...video, ...action.payload } : video
        ),
      };
    case 'SET_VIDEOS':
      return {
        ...state,
        videos: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, {
    videos: [],
    loading: false,
  });

  // Save to Media Library instead of uploading
  /*
  const addVideo = useCallback(async (videoData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const asset = await MediaLibrary.createAssetAsync(videoData.uri);

      const newVideo = {
        id: Date.now().toString(),
        localUri: videoData.uri,
        mediaLibraryUri: asset.uri,
        duration: videoData.duration || 15,
        createdAt: new Date().toISOString(),
        status: 'saved',
      };

      dispatch({ type: 'ADD_VIDEO', payload: newVideo });

      await saveVideosToStorage([newVideo, ...state.videos]);
    } catch (error) {
      console.error('Failed to save video to media library:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.videos]);
*/

const addVideo = useCallback(async (videoData) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Save to media library
    const asset = await MediaLibrary.createAssetAsync(videoData.uri);

    const newVideo = {
      id: Date.now().toString(),
      localUri: videoData.uri,
      mediaLibraryUri: asset.uri,
      duration: videoData.duration || 15,
      createdAt: new Date().toISOString(),
      status: 'saved',
    };

    // Dispatch immediately to show locally
    dispatch({ type: 'ADD_VIDEO', payload: newVideo });
    await saveVideosToStorage([newVideo, ...state.videos]);

    // Upload to Cloudinary
    const cloudResponse = await uploadVideoWithRetry(videoData.uri, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });

    // If upload is successful, update video with cloud URL
    dispatch({
      type: 'UPDATE_VIDEO',
      payload: {
        id: newVideo.id,
        cloudinaryUrl: cloudResponse.secure_url,
        status: 'uploaded',
      },
    });

    await saveVideosToStorage(
      [ { ...newVideo, cloudinaryUrl: cloudResponse.secure_url, status: 'uploaded' }, ...state.videos ]
    );

    console.log('Video uploaded to Cloudinary:', cloudResponse.secure_url);

  } catch (error) {
    console.error('Error in addVideo:', error);
    // You could dispatch an error state or retry UI here
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, [state.videos]);

  const saveVideosToStorage = async (videos) => {
    try {
      await AsyncStorage.setItem('savedVideos', JSON.stringify(videos));
    } catch (error) {
      console.error('Failed to save videos to storage:', error.message);
    }
  };

  const loadVideosFromStorage = useCallback(async () => {
    try {
      const savedVideos = await AsyncStorage.getItem('savedVideos');
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        dispatch({ type: 'SET_VIDEOS', payload: videos });
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  }, []);

  useEffect(() => {
    loadVideosFromStorage();
  }, [loadVideosFromStorage]);

  return (
    <VideoContext.Provider
      value={{
        videos: state.videos,
        loading: state.loading,
        addVideo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
