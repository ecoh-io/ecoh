// src/utils/permissions.ts
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';

/**
 * Requests permission to access the media library.
 * Alerts the user if permission is denied.
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera roll permissions are required to select images.',
      );
      return false;
    }
  }
  return true;
};
