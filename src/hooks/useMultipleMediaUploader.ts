import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  uploadMultipleImages,
  MultiUploadProgressCallback,
  MultiUploadResult,
} from '../services/mediaUploader';
import { MediaType } from '../enums/media-type.enum';

// Interface for tracking upload progress of multiple assets
interface UploadProgress {
  [assetId: string]: number;
}

/**
 * Hook for handling multiple media uploads with progress tracking
 * @param userId - The current user's ID
 * @param mediaType - Optional media type (defaults to PROFILE_PICTURE)
 */
export const useMultipleMediaUploader = (
  userId: string,
  mediaType?: MediaType,
) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<Error | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  /**
   * Handles uploading multiple images with progress tracking
   * @param imageAssets - Array of image assets to upload
   * @param albumId - Optional album ID to associate with uploads
   * @param tags - Optional tags to associate with uploads
   * @returns Array of objects containing the image URIs and IDs
   */
  const handleMultipleUpload = async (
    imageAssets: ImagePicker.ImagePickerAsset[],
    albumId?: string,
    tags?: string[],
  ): Promise<MultiUploadResult[]> => {
    // Initialize progress tracking for each asset
    const initialProgress: UploadProgress = {};
    imageAssets.forEach((asset) => {
      initialProgress[asset.assetId || asset.uri] = 0;
    });

    setUploadProgress(initialProgress);
    setError(null);
    setIsUploading(true);

    // Create progress callback for individual assets
    const progressCallback: MultiUploadProgressCallback = (
      assetId,
      progress,
    ) => {
      setUploadProgress((prev) => ({
        ...prev,
        [assetId]: progress,
      }));
    };

    try {
      const results = await uploadMultipleImages(
        imageAssets,
        userId,
        progressCallback,
        mediaType || MediaType.PROFILE_PICTURE,
        albumId,
        tags,
      );
      setIsUploading(false);
      return results;
    } catch (err: any) {
      setError(err);
      setIsUploading(false);
      throw err;
    }
  };

  // Calculate overall progress (average of all assets)
  const overallProgress =
    Object.values(uploadProgress).length > 0
      ? Object.values(uploadProgress).reduce(
          (sum, progress) => sum + progress,
          0,
        ) / Object.values(uploadProgress).length
      : 0;

  return {
    uploadProgress, // Individual progress for each asset
    overallProgress, // Average progress across all assets
    isUploading, // Whether any uploads are in progress
    error, // Any error that occurred
    handleMultipleUpload,
  };
};
