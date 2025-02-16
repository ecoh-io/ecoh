import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';
import Input from '@/src/UI/Input';
import * as Yup from 'yup';
import FormikEcohDropdown from '@/src/UI/Dropdown/FormikDropdown';
import { Visibility } from '@/src/enums/visibility.enum';
import { FormikProvider, useFormik } from 'formik';
import { Entypo } from '@expo/vector-icons';
import Button from '@/src/UI/Button';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMediaUploader } from '@/src/hooks/useMediaUploader';
import { pickSingleImage } from '@/src/services/imagePicker';
import { useAuthStore } from '@/src/store/AuthStore';
import { useCreateAlbum } from '@/src/api/album/useAlbumMutations';
import { MediaType } from '@/src/enums/media-type.enum';

const CreateAlbumSchema = Yup.object().shape({
  name: Yup.string().required('Album name is required'),
  visibility: Yup.string()
    .oneOf(Object.values(Visibility))
    .required('Visibility is required'),
});

const CreateAlbum = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const { handleUpload } = useMediaUploader(
    user!.id,
    MediaType.ALBUM_COVER_IMAGE,
  );
  const { mutate: createAlbum } = useCreateAlbum();

  const handleSelectImage = useCallback(async () => {
    const imageAsset = await pickSingleImage();
    if (imageAsset) {
      setSelectedImage(imageAsset);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      visibility: Visibility.PRIVATE,
    },
    validationSchema: CreateAlbumSchema,
    onSubmit: async (values) => {
      if (selectedImage) {
        try {
          const { id } = await handleUpload(selectedImage);

          await createAlbum({
            name: values.name,
            visibility: values.visibility,
            coverPhotoId: id,
          });
        } catch (uploadError) {
          console.error('Error uploading cover photo:', uploadError);
          Alert.alert(
            'Upload Failed',
            'There was an error uploading the cover photo.',
          );
          return;
        }
      }
    },
  });

  const visibilityOptions = Object.entries(Visibility).map(([key, value]) => ({
    id: value,
    label:
      key.charAt(0).toUpperCase() +
      key.slice(1).toLowerCase().replace('_', ' '),
    value: value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Entypo name="chevron-left" size={38} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Create New Album
        </Text>
      </View>

      <View style={{ flexDirection: 'column', gap: 5, flex: 1 }}>
        <FormikProvider value={formik}>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              gap: 10,
              flex: 1,
            }}
            onPress={handleSelectImage}
          >
            {selectedImage ? (
              <View style={{ flex: 1 }}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 16,
                    resizeMode: 'cover',
                  }}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.imageOverlay}
                >
                  <Text
                    style={[
                      styles.imageOverlayText,
                      !formik.values.name && styles.placeholderText,
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {formik.values.name || 'Album Title'}
                  </Text>
                </LinearGradient>
              </View>
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  flex: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.secondary,
                  borderRadius: 16,
                  paddingHorizontal: 8,
                  paddingVertical: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <Entypo name="plus" size={64} color={colors.secondary} />
                <Text
                  style={[styles.coverPhotoText, { color: colors.secondary }]}
                >
                  Add Cover Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'column',
              gap: 14,
              justifyContent: 'flex-end',
              zIndex: 800,
            }}
          >
            <FormikEcohDropdown
              options={visibilityOptions.map((visibility) => ({
                id: visibility.id,
                label: visibility.label,
                value: visibility.value,
              }))}
              name="visibility"
              placeholder="visibility"
              style={{ width: '60%' }}
            />
            <Input
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              placeholder="Album Name"
              placeholderTextColor={colors.highlight}
              error={
                formik.touched.name && !formik.values.name
                  ? formik.errors.name
                  : undefined
              }
              LeftAccessory={() => (
                <Entypo name="images" size={24} color={colors.secondary} />
              )}
            />
            <Button
              variant="primary"
              title="Create Album"
              size="large"
              onPress={() => formik.handleSubmit()}
              gradientColors={['#00c6ff', '#0072ff']}
              loading={formik.isSubmitting}
            />
          </View>
        </FormikProvider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  coverPhotoText: {
    fontSize: 21,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    marginLeft: -16,
  },
  backButton: {
    paddingRight: 10,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%', // Adjust this value to control how much of the image is covered by the gradient
    justifyContent: 'flex-end',
    padding: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 21,
    fontFamily: typography.fontFamilies.poppins.medium,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginVertical: 8,
  },
  placeholderText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    opacity: 0.7,
  },
});

export default CreateAlbum;
