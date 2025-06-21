
// services/cloudinaryService.js - Cloudinary Integration
/*import { Cloudinary } from '@cloudinary/react-native';

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: 'YOUR_CLOUD_NAME', // Replace with your Cloudinary cloud name
  },
});





export const uploadVideoToCloudinary = async (videoUri, onProgress) => {
  try {
    // Configure upload options for HLS
    const options = {
      upload_preset: 'lightoheightcloud', // Replace with your upload preset
      resource_type: 'video',
      folder: 'video_feed',
      eager: [
        {
          streaming_profile: 'hd',
          format: 'm3u8'
        }
      ],
      eager_async: true,
      notification_url: 'YOUR_WEBHOOK_URL' // Optional: for upload completion notifications
    };

    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', {
      uri: videoUri,
      type: 'video/mp4',
      name: `video_${Date.now()}.mp4`,
    });
    
    // Add upload options to FormData
    Object.keys(options).forEach(key => {
      if (key === 'eager') {
        formData.append(key, JSON.stringify(options[key]));
      } else {
        formData.append(key, options[key]);
      }
    });

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/dqxy4qsre/video/upload`);
      
   
      xhr.timeout = 60000; // 60 second timeout
      xhr.send(formData);
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Alternative: Using fetch with retry logic
export const uploadVideoWithRetry = async (videoUri, onProgress, maxRetries = 3) => {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await uploadVideoToCloudinary(videoUri, onProgress);
    } catch (error) {
      retryCount++;
      console.log(`Upload attempt ${retryCount} failed:`, error.message);
      
      if (retryCount >= maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
};


*/














export const uploadVideoToCloudinary = async (videoUri, onProgress) => {
  try {
    const options = {
      upload_preset: 'lightoheightcloud',
      resource_type: 'video',
      folder: 'video_feed',
      eager: [
        {
          streaming_profile: 'hd',
          format: 'm3u8',
        },
      ],
      eager_async: true,
      notification_url: 'YOUR_WEBHOOK_URL',
    };

    const formData = new FormData();
    formData.append('file', {
      uri: videoUri,
      type: 'video/mp4',
      name: `video_${Date.now()}.mp4`,
    });

    Object.keys(options).forEach((key) => {
      formData.append(key, key === 'eager' ? JSON.stringify(options[key]) : options[key]);
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
      xhr.addEventListener('timeout', () => reject(new Error('Upload timeout')));

      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dqxy4qsre/video/upload');
      xhr.timeout = 60000;
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
