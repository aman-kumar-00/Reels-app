import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

import {uploadReel} from '../service/cloudinaryUpload';

const BACKEND_URL = 'http://localhost:5000';

export default function Home() {
  const [video, setVideo] = useState<Asset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] =
    useState('');

  const selectVideo = async () => {
    setUploadMessage('');

    const result = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      console.log(
        'VIDEO PICKER ERROR:',
        result.errorMessage,
      );

      setUploadMessage(
        result.errorMessage ||
          'Failed to select video',
      );

      return;
    }

    const selectedVideo = result.assets?.[0];

    if (!selectedVideo?.uri) {
      setUploadMessage(
        'No video URI received',
      );

      return;
    }

    console.log(
      'SELECTED VIDEO:',
      selectedVideo,
    );

    setVideo(selectedVideo);
  };

  const handleUpload = async () => {
    if (!video?.uri) {
      setUploadMessage(
        'Please select a video first',
      );

      return;
    }

    try {
      setUploading(true);

      setUploadMessage(
        'Uploading video to Cloudinary...',
      );

      // ==========================================
      // STEP 1: Upload video to Cloudinary
      // ==========================================

      const cloudinaryResult = await uploadReel(
        video.uri,
        video.fileName,
      );

      console.log(
        'CLOUDINARY RESULT:',
        cloudinaryResult,
      );

      // ==========================================
      // STEP 2: Save Cloudinary information
      //         to MongoDB Atlas
      // ==========================================

      setUploadMessage(
        'Cloudinary upload successful!\n\nSaving reel to MongoDB...',
      );

      const databaseResponse = await fetch(
        `${BACKEND_URL}/api/reels`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            title:
              video.fileName ||
              'Untitled Reel',

            videoUrl:
              cloudinaryResult.secure_url,

            publicId:
              cloudinaryResult.public_id,

            description: '',
          }),
        },
      );

      // Check HTTP response
      if (!databaseResponse.ok) {
        const errorText =
          await databaseResponse.text();

        console.log(
          'DATABASE ERROR:',
          errorText,
        );

        throw new Error(
          `MongoDB request failed: ${databaseResponse.status}`,
        );
      }

      const databaseResult =
        await databaseResponse.json();

      console.log(
        'MONGODB RESULT:',
        databaseResult,
      );

      // ==========================================
      // STEP 3: Everything succeeded
      // ==========================================

      setUploadMessage(
        'Reel uploaded successfully!\n\n' +
          'Cloudinary: ✓\n' +
          'MongoDB Atlas: ✓',
      );
    } catch (error) {
      console.error(
        'UPLOAD ERROR:',
        error,
      );

      setUploadMessage(
        `Upload failed:\n\n${String(error)}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Upload Reel
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={selectVideo}>
        <Text style={styles.buttonText}>
          Select Video
        </Text>
      </TouchableOpacity>

      {video && (
        <View style={styles.info}>
          <Text style={styles.label}>
            Selected video:
          </Text>

          <Text style={styles.text}>
            {video.fileName || 'Unknown file'}
          </Text>

          {video.fileSize && (
            <Text style={styles.text}>
              Size:{' '}
              {(
                video.fileSize /
                (1024 * 1024)
              ).toFixed(2)}{' '}
              MB
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.uploadButton,
              uploading &&
                styles.disabledButton,
            ]}
            onPress={handleUpload}
            disabled={uploading}>
            <Text style={styles.buttonText}>
              {uploading
                ? 'Uploading...'
                : 'Upload Reel'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {uploadMessage !== '' && (
        <Text style={styles.message}>
          {uploadMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  uploadButton: {
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  info: {
    marginTop: 30,
    width: '100%',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  text: {
    fontSize: 13,
    marginBottom: 8,
  },

  message: {
    marginTop: 25,
    fontSize: 13,
    textAlign: 'center',
  },
});