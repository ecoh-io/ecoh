import React, { useState, useCallback } from 'react';
import { Colors } from '@/src/types/color';
import { User } from '@/src/types/user';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import { styles } from './ProfileInfo.styles';
import { memo } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'expo-image';

const DEFAULT_PROFILE_IMAGE_URL = 'https://via.placeholder.com/100';

interface ProfileInfoProps {
  user: User;
  colors: Colors;
  onUpdateProfileImage?: (newImageUri: string) => Promise<void>; // Optional callback to handle image upload
}

// Reusable Profile Info Component
const ProfileInfo: React.FC<ProfileInfoProps> = memo(
  ({ user, colors, onUpdateProfileImage }) => {
    const [profileImageUri, setProfileImageUri] = useState<string>(
      user.profileImage || DEFAULT_PROFILE_IMAGE_URL,
    );
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(
      null,
    );

    const requestPermission = async () => {
      // Only request permissions on iOS; Android handles permissions automatically
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Sorry, we need camera roll permissions to make this work!',
          );
          return false;
        }
      }
      return true;
    };

    const manipulateImage = useCallback(async (uri: string) => {
      const actions = [
        { resize: { width: 250 } }, // Resize to width of 800px
      ];
      const saveOptions = {
        compress: 0.7, // Compress to 70%
        format: SaveFormat.JPEG, // Convert to JPEG
        base64: false, // No need for base64
      };

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        saveOptions,
      );
      return manipulatedImage;
    }, []);

    const handleSelectImage = useCallback(async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      try {
        const result: ImagePicker.ImagePickerResult =
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio for cropping
            quality: 0.7,
          });

        if (result.canceled) {
          return;
        }

        const selectedAsset = result.assets[0];
        if (selectedAsset?.uri) {
          const newUri = selectedAsset.uri;

          // Set the selected image URI and show the modal for preview
          setSelectedImageUri(newUri);
          setTimeout(
            () => setIsModalVisible(true),
            Platform.OS === 'ios' ? 500 : 0,
          );
        }
      } catch (error) {
        console.error('Image selection error:', error);
        Alert.alert(
          'Error',
          'An unexpected error occurred while selecting the image.',
        );
      }
    }, [requestPermission]);

    const handleConfirmImage = useCallback(async () => {
      if (selectedImageUri) {
        setProfileImageUri(selectedImageUri);
        setSelectedImageUri(null);
        setIsModalVisible(false);
      }
    }, [selectedImageUri]);

    const handleCancelImage = useCallback(() => {
      setSelectedImageUri(null);
      setIsModalVisible(false);
    }, []);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleSelectImage}
          accessibilityLabel="Change profile picture"
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
              accessibilityLabel="Profile picture"
              contentFit="cover"
            />
            {isUploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.profileTextContainer}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user.displayName ?? 'Unnamed User'}
          </Text>
          <Text style={[styles.username, { color: colors.text }]}>
            {user.username ?? 'username'}
          </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleCancelImage}
          onDismiss={handleCancelImage}
        >
          <View style={styles.modalBackground}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Preview Profile Image
              </Text>
              {selectedImageUri && (
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.modalImage}
                  contentFit="cover"
                />
              )}
              <View style={styles.modalButtonsContainer}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelImage}
                  accessibilityLabel="Cancel image selection"
                  accessibilityRole="button"
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.primary }]}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmImage}
                  accessibilityLabel="Confirm image selection"
                  accessibilityRole="button"
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.primary }]}
                  >
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);

export default ProfileInfo;
