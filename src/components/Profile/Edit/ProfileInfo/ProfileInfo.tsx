import React, { useState, useCallback, useEffect } from 'react';
import { Colors } from '@/src/types/color';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import { styles } from './ProfileInfo.styles';
import { memo } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { User } from '@/src/interfaces/user';
import { MediaType } from '@/src/enums/media-type.enum';
import axiosInstance from '@/src/api/axiosInstance';
import { useEdit } from '@/src/context/EditContext';
import { useMutation } from '@tanstack/react-query';
import CircularProgressIndicator from '@/src/components/CircularProgressIndicator/CircularProgressIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Button from '@/src/UI/Button';

const DEFAULT_PROFILE_IMAGE_URL = 'https://via.placeholder.com/100';

interface ProfileInfoProps {
  user: User;
  colors: Colors;
}

// Reusable Profile Info Component
const ProfileInfo: React.FC<ProfileInfoProps> = memo(({ user, colors }) => {
  const { updateProfilePictureUrl } = useEdit();
  const [profileImageUri, setProfileImageUri] = useState<string>(
    user.profile.profilePictureUrl || DEFAULT_PROFILE_IMAGE_URL,
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {}, [uploadProgress]);

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

  const uploadProfileImage = async (
    imageAsset: ImagePicker.ImagePickerAsset,
    userId: string,
    onUploadProgress: (progress: number) => void,
  ) => {
    try {
      // Step 1: Request a pre-signed URL from the Media Service
      const presignResponse = await axiosInstance.post(`/media/presigned-url`, {
        type: MediaType.PROFILE_PICTURE,
        mimetype: imageAsset.mimeType,
        userId: userId,
      });

      const { url, key, mediaId } = presignResponse.data;

      // Step 2: Upload the image to S3 using the pre-signed URL
      const response = await fetch(imageAsset.uri);
      const blob = await response.blob();

      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', imageAsset.type!);

        let startTime: number;
        let lastProgressUpdate = 0;

        xhr.upload.onloadstart = () => {
          startTime = Date.now();
        };

        xhr.upload.onprogress = (event) => {
          const now = Date.now();
          if (now - lastProgressUpdate > 1000) {
            // Update progress max once per second
            lastProgressUpdate = now;

            let percentCompleted;
            if (event.lengthComputable) {
              percentCompleted = Math.round((event.loaded * 100) / event.total);
            } else {
              // Fallback: Estimate progress based on time elapsed
              const elapsedSeconds = (now - startTime) / 1000;
              percentCompleted = Math.min(99, Math.round(elapsedSeconds * 10)); // Assume 10% per second, max 99%
            }

            onUploadProgress(percentCompleted);
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            onUploadProgress(100); // Ensure 100% is reported on completion
            // Step 3: Notify the Media Service that the upload is complete
            try {
              await axiosInstance.post(`/media/complete-upload`, {
                mediaId,
                key,
                userId: userId,
              });

              resolve(imageAsset.uri);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('XHR request failed'));
        };

        xhr.send(blob);
      });
    } catch (error) {
      throw error;
    }
  };

  // Set up the mutation with React Query
  const { mutate: mutateUpload, isPending: isUploading } = useMutation<
    string,
    Error,
    ImagePicker.ImagePickerAsset
  >({
    mutationFn: (imageAsset) =>
      uploadProfileImage(imageAsset, user.id, setUploadProgress),
    onMutate: () => {
      setUploadProgress(0);
    },
    onSuccess: (profilePictureUrl) => {
      setUploadProgress(100);
      setProfileImageUri(profilePictureUrl);
      updateProfilePictureUrl(profilePictureUrl);
      setTimeout(() => {
        Alert.alert('Success', 'Profile image uploaded successfully!');
        setUploadProgress(0);
      }, 1000);
    },
    onError: (error) => {
      setUploadProgress(0);
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'There was an error uploading your image.');
    },
    onSettled: () => {
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    },
  });

  const handleSelectImage = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
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
  }, []);

  const handleConfirmImage = useCallback(() => {
    if (selectedImage) {
      setIsModalVisible(false); // Dismiss the modal immediately
      mutateUpload(selectedImage); // Trigger the upload mutation
      setSelectedImage(null); // Reset selected image
    }
  }, [selectedImage, mutateUpload]);

  const handleCancelImage = useCallback(() => {
    setSelectedImage(null);
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
          {(isUploading || uploadProgress > 0) && (
            <View style={styles.uploadOverlay}>
              <CircularProgressIndicator
                size={styles.profileImage.width}
                strokeWidth={4}
                progress={uploadProgress}
                gradientColors={[colors.gradient[0], colors.gradient[1]]}
              />
            </View>
          )}
          <LinearGradient
            colors={[colors.gradient[0], colors.gradient[1]]}
            style={styles.addButton}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </LinearGradient>
        </View>
      </TouchableOpacity>
      <View style={styles.profileTextContainer}>
        <Text style={[styles.name, { color: colors.text }]}>
          {user.name ?? 'Unnamed User'}
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
        <BlurView intensity={25} style={styles.modalBackground}>
          <View style={[styles.modalContainer]}>
            {selectedImage && (
              <View style={styles.modalImageContainer}>
                <Text style={styles.modalTitle}>
                  Confirm Your Profile Photo
                </Text>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.modalImage}
                  contentFit="cover"
                />
              </View>
            )}
            <View style={styles.modalButtonsContainer}>
              <Button
                title="Cancel"
                onPress={handleCancelImage}
                variant="secondary"
                size="large"
                style={{ flex: 1 }}
              />
              <Button
                title="Confirm"
                onPress={handleConfirmImage}
                variant="primary"
                style={{ flex: 1 }}
                size="large"
                gradientColors={[colors.gradient[0], colors.gradient[1]]}
              />
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
});

export default ProfileInfo;
