// src/hooks/useMediaUploader.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage, UploadProgressCallback } from '../services/mediaUploader';
import { MediaType } from '../enums/media-type.enum';

export const useMediaUploader = (userId: string, mediaType?: MediaType) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);

  const handleUpload = async (
    imageAsset: ImagePicker.ImagePickerAsset,
  ): Promise<{ uri: string; id: string }> => {
    setUploadProgress(0);
    setError(null);

    const progressCallback: UploadProgressCallback = (progress) => {
      setUploadProgress(progress);
    };

    try {
      const { uri, id } = await uploadImage(
        imageAsset,
        userId,
        progressCallback,
        mediaType,
      );
      return { uri, id };
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return { uploadProgress, error, handleUpload };
};
