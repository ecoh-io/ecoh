import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';
import * as Yup from 'yup';
import { Visibility } from '@/src/enums/visibility.enum';
import { FormikProvider, useFormik } from 'formik';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useMediaUploader } from '@/src/hooks/useMediaUploader';
import { pickSingleImage } from '@/src/services/imagePicker';
import { useAuthStore } from '@/src/store/AuthStore';
import { useCreateAlbum } from '@/src/api/album/useAlbumMutations';
import { MediaType } from '@/src/enums/media-type.enum';
import Input from '@/src/components/atoms/Input';
import Button from '@/src/components/atoms/Button';
import FormikEcohDropdown from '@/src/components/molecules/Dropdown/FormikWrapper';

const CreateAlbumSchema = Yup.object().shape({
  name: Yup.string().required('Album name is required'),
  visibility: Yup.string()
    .oneOf(Object.values(Visibility))
    .required('Visibility is required'),
});

const CreateAlbum: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const { handleUpload } = useMediaUploader(
    user!.id,
    MediaType.ALBUM_COVER_IMAGE,
  );
  const { mutate: createAlbum } = useCreateAlbum();

  const { width: screenWidth } = Dimensions.get('window');

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const width = screenWidth * 0.5;

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

  const iconColor = useMemo(() => {
    if (formik.errors.name && formik.touched.name) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.name, formik.touched.name]);

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

      <View style={{ flexDirection: 'column', gap: 30, flex: 1 }}>
        <FormikProvider value={formik}>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              gap: 14,
              alignItems: 'center',
            }}
            onPress={handleSelectImage}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                style={{
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  borderStyle: 'dashed',
                  borderColor: colors.secondary,
                  paddingHorizontal: 8,
                  paddingVertical: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <Entypo name="plus" size={48} color={colors.secondary} />
                <Text
                  style={[styles.coverPhotoText, { color: colors.secondary }]}
                >
                  Add Cover Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
          <View
            style={{
              flexDirection: 'column',
              gap: 14,
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
              leftIcon={
                <Entypo name="eye" size={24} color={colors.secondary} />
              }
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
                <Entypo name="images" size={24} color={iconColor} />
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
    fontSize: 18,
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
  imageOverlayText: {
    fontSize: 21,
    fontFamily: typography.fontFamilies.poppins.medium,
    alignSelf: 'center',
  },
  placeholderText: {
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default CreateAlbum;
