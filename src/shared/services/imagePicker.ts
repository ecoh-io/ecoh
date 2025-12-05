// src/services/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { requestMediaLibraryPermission } from '../utils/permissions';

/**
 * Launches the image picker to select a single image.
 * @param allowsEditing - Whether to allow basic editing (defaults to true).
 * @returns A selected image asset or null if cancelled.
 */
export const pickSingleImage = async (
  allowsEditing: boolean = true,
): Promise<ImagePicker.ImagePickerAsset | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return null;
    }
    return result.assets[0];
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'An error occurred while selecting the image.');
    return null;
  }
};

/**
 * Launches the image picker to select multiple images.
 * Note: `allowsMultipleSelection` is supported only on certain platforms/versions.
 * @returns An array of selected image assets or null if cancelled.
 */
export const pickMultipleImages = async (
  mediaType: ImagePicker.MediaTypeOptions = ImagePicker.MediaTypeOptions.All,
): Promise<ImagePicker.ImagePickerAsset[] | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsMultipleSelection: true,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (result.canceled || result.assets.length === 0) {
      return null;
    }
    return result.assets;
  } catch (error) {
    console.error('Error picking images:', error);
    Alert.alert('Error', 'An error occurred while selecting images.');
    return null;
  }
};
