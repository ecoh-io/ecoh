// useMediaUploader.ts
import { MediaType } from '../enums/media-type.enum';
import axiosInstance from '../api/axiosInstance';
import * as ImagePicker from 'expo-image-picker';

/**
 * Requests a presigned URL for the upload.
 */
const requestPresignedUrl = async (
  imageAsset: ImagePicker.ImagePickerAsset,
  userId: string,
) => {
  const { data } = await axiosInstance.post(`/media/presigned-url`, {
    type: MediaType.PROFILE_PICTURE,
    mimetype: imageAsset.mimeType,
    userId,
  });
  return data; // { url, key, mediaId }
};

/**
 * Converts an image URI to a Blob.
 */
const getBlobFromUri = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

/**
 * Performs the actual upload to S3 with progress tracking.
 */
const uploadToS3 = (
  url: string,
  blob: Blob,
  contentType: string,
  onUploadProgress: (progress: number) => void,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', contentType);

    let startTime: number;
    let lastProgressUpdate = 0;

    xhr.upload.onloadstart = () => {
      startTime = Date.now();
    };

    xhr.upload.onprogress = (event) => {
      const now = Date.now();
      if (now - lastProgressUpdate > 1000) {
        // update once per second
        lastProgressUpdate = now;
        let percentCompleted: number;
        if (event.lengthComputable) {
          percentCompleted = Math.round((event.loaded * 100) / event.total);
        } else {
          // Fallback: Estimate progress based on time elapsed
          const elapsedSeconds = (now - startTime) / 1000;
          percentCompleted = Math.min(99, Math.round(elapsedSeconds * 10));
        }
        onUploadProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        onUploadProgress(100);
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload.'));
    };

    xhr.send(blob);
  });
};

/**
 * Completes the upload by notifying the media service.
 */
const completeUpload = async (mediaId: string, key: string, userId: string) => {
  await axiosInstance.post(`/media/complete-upload`, { mediaId, key, userId });
};

/**
 * Hook or service function that uploads a profile image.
 */
export const uploadProfileImage = async (
  imageAsset: ImagePicker.ImagePickerAsset,
  userId: string,
  onUploadProgress: (progress: number) => void,
): Promise<string> => {
  try {
    // Step 1: Get presigned URL
    const { url, key, mediaId } = await requestPresignedUrl(imageAsset, userId);

    // Step 2: Convert image to Blob
    const blob = await getBlobFromUri(imageAsset.uri);

    // Step 3: Upload Blob to S3
    await uploadToS3(url, blob, imageAsset.type!, onUploadProgress);

    // Step 4: Notify Media Service of Completion
    await completeUpload(mediaId, key, userId);

    // Return the image URI or any identifier as needed
    return imageAsset.uri;
  } catch (error) {
    // You can add logging or additional error handling here
    throw error;
  }
};
