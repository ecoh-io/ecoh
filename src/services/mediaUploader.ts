// src/services/mediaUploader.ts
import axiosInstance from '@/src/api/axiosInstance';
import * as ImagePicker from 'expo-image-picker';
import { MediaType } from '@/src/enums/media-type.enum';

/** Callback type to report upload progress (0 to 100) */
export type UploadProgressCallback = (progress: number) => void;

/** Response shape for the pre-signed URL request */
export interface PresignedUrlResponse {
  url: string;
  key: string;
  mediaId: string;
}

/**
 * Requests a pre-signed URL from your media service.
 * @param imageAsset - The selected image asset.
 * @param userId - The ID of the current user.
 * @param mediaType - The media type (default is PROFILE_PICTURE).
 */
export const requestPresignedUrl = async (
  imageAsset: ImagePicker.ImagePickerAsset,
  userId: string,
  mediaType: string = MediaType.PROFILE_PICTURE,
): Promise<PresignedUrlResponse> => {
  const { data } = await axiosInstance.post(`/media/presigned-url`, {
    type: mediaType,
    mimetype: imageAsset.mimeType,
    userId,
  });
  return data;
};

/**
 * Converts a local file URI to a Blob.
 * @param uri - The file URI.
 */
export const getBlobFromUri = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return response.blob();
};

/**
 * Uploads a Blob to S3 using a pre-signed URL.
 * Reports progress via the provided callback.
 * @param url - The pre-signed URL.
 * @param blob - The Blob to upload.
 * @param contentType - The MIME type of the image.
 * @param onUploadProgress - Callback for progress updates.
 */
export const uploadToS3 = (
  url: string,
  blob: Blob,
  contentType: string,
  onUploadProgress: UploadProgressCallback,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', contentType);

    let startTime = Date.now();
    let lastProgressUpdate = 0;

    xhr.upload.onloadstart = () => {
      startTime = Date.now();
    };

    xhr.upload.onprogress = (event) => {
      const now = Date.now();
      if (now - lastProgressUpdate > 1000) {
        lastProgressUpdate = now;
        let percentCompleted = 0;
        if (event.lengthComputable) {
          percentCompleted = Math.round((event.loaded * 100) / event.total);
        } else {
          // Fallback: estimate progress based on elapsed time
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
 * @param mediaId - The media ID returned from the presigned URL request.
 * @param key - The storage key returned from the presigned URL request.
 * @param userId - The ID of the current user.
 */
export const completeUpload = async (
  mediaId: string,
  key: string,
  userId: string,
): Promise<void> => {
  await axiosInstance.post(`/media/complete-upload`, {
    mediaId,
    key,
    userId,
  });
};

/**
 * Runs the full image upload flow:
 * 1. Request a pre-signed URL.
 * 2. Convert the image URI to a Blob.
 * 3. Upload the Blob to S3 with progress tracking.
 * 4. Notify your media service that the upload is complete.
 * @param imageAsset - The selected image asset.
 * @param userId - The current user’s ID.
 * @param onUploadProgress - Callback to report progress.
 * @param mediaType - (Optional) Type of media (defaults to PROFILE_PICTURE).
 * @returns The image URI (or identifier) upon success.
 */
export const uploadImage = async (
  imageAsset: ImagePicker.ImagePickerAsset,
  userId: string,
  onUploadProgress: UploadProgressCallback,
  mediaType: string = MediaType.PROFILE_PICTURE,
): Promise<{ uri: string; id: string }> => {
  try {
    // Step 1: Request a pre-signed URL.
    const { url, key, mediaId } = await requestPresignedUrl(
      imageAsset,
      userId,
      mediaType,
    );

    // Step 2: Convert the image URI to a Blob.
    const blob = await getBlobFromUri(imageAsset.uri);

    // (Optional Enhancement) Validate or compress the blob here if needed.

    // Step 3: Upload the Blob to S3 with progress tracking.
    await uploadToS3(url, blob, imageAsset.type!, onUploadProgress);

    // Step 4: Complete the upload by notifying your media service.
    await completeUpload(mediaId, key, userId);

    // Return the image URI or any identifier your app requires.
    return { uri: imageAsset.uri, id: mediaId };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};
