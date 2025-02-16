import React, { useState, useCallback } from 'react';
import { Colors } from '@/src/types/color';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { styles } from './ProfileInfo.styles';
import { memo } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { User } from '@/src/interfaces/user';
import { useEdit } from '@/src/context/EditContext';
import { useMutation } from '@tanstack/react-query';
import CircularProgressIndicator from '@/src/components/CircularProgressIndicator/CircularProgressIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Button from '@/src/UI/Button';
import { useMediaUploader } from '@/src/hooks/useMediaUploader';

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

  // Use our custom hook to handle the upload flow.
  const { uploadProgress, error, handleUpload } = useMediaUploader(user.id);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera roll permissions to make this work!',
      );
      return false;
    }
    return true;
  };

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
        // Open the modal after a slight delay on iOS.
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

  const handleConfirmImage = useCallback(async () => {
    if (selectedImage) {
      setIsModalVisible(false); // Dismiss modal immediately
      try {
        const { uri } = await handleUpload(selectedImage);
        setProfileImageUri(uri);
        updateProfilePictureUrl(uri);
        Alert.alert('Success', 'Profile image uploaded successfully!');
      } catch (err) {
        console.error('Upload error:', err);
        Alert.alert(
          'Upload Failed',
          'There was an error uploading your image.',
        );
      } finally {
        setSelectedImage(null);
      }
    }
  }, [selectedImage, handleUpload, updateProfilePictureUrl]);

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
          {uploadProgress > 0 && (
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
          <View style={styles.modalContainer}>
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
