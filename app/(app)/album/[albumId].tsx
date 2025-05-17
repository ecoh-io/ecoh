import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAlbum } from '@/src/api/album/useAlbumQuries';
import { useDeleteAlbum } from '@/src/api/album/useAlbumMutations';
import { pickMultipleImages } from '@/src/services/imagePicker';
import { typography } from '@/src/theme/typography';
import { Media } from '@/src/types/Media';
import { useMultipleMediaUploader } from '@/src/hooks/useMultipleMediaUploader';
import { MediaType } from '@/src/enums/media-type.enum';
import { useAuthStore } from '@/src/store/AuthStore';
import { Footer, GridItem, Header } from '@/src/components/molecules/Albums';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

// --- Constants & Grid Sizing ---
const TOTAL_CELLS = 12;
const NUM_COLUMNS = 3;
const MARGIN = 8;
const screenWidth = Dimensions.get('window').width - 8;
const totalMargin = MARGIN * (NUM_COLUMNS + 1);
export const itemWidth = (screenWidth - totalMargin) / NUM_COLUMNS;
export const itemHeight = itemWidth * 1.5;

// --- Types ---
interface PlaceholderItem {
  placeholder: true;
}
export type GridDataItem =
  | 'Add Photos'
  | (Media | ImagePicker.ImagePickerAsset)
  | PlaceholderItem;

// --- Main Screen Component ---
const AlbumDetailsScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { albumId } = useLocalSearchParams();
  const { data: album, isLoading } = useAlbum(albumId?.toString() || '');
  const { colors } = useTheme();
  const { mutate: deleteAlbum } = useDeleteAlbum();

  // State for images added by the user via the picker
  const [userImages, setUserImages] = useState<ImagePicker.ImagePickerAsset[]>(
    [],
  );
  // Local copy of album media (for deletion)
  const [albumMedia, setAlbumMedia] = useState<Media[]>([]);
  // Edit mode flag and set of selected image URIs for deletion
  const [editMode, setEditMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(
    new Set(),
  );

  // Modal state for image preview
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const { uploadProgress, error, handleMultipleUpload } =
    useMultipleMediaUploader(user!.id, MediaType.VIDEO);

  // When album data is available, set local album media state
  useEffect(() => {
    if (album?.mediaItems) {
      setAlbumMedia(album.mediaItems);
    }
  }, [album]);

  // --- Handlers ---
  // Delete entire album
  const handleDeleteAlbum = useCallback(() => {
    Alert.alert('Delete Album', 'Are you sure you want to delete this album?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAlbum(albumId?.toString() || ''),
      },
    ]);
  }, [albumId, deleteAlbum]);

  // Add photos via image picker
  const handleAddPhotos = useCallback(async () => {
    const imageAssets = await pickMultipleImages();
    if (imageAssets && imageAssets.length > 0) {
      setUserImages((prev) => {
        const existing = new Set(prev.map((img) => img.uri));
        const newAssets = imageAssets.filter((img) => !existing.has(img.uri));
        return [...prev, ...newAssets];
      });
      try {
        setIsUploading(true);
        const uploadedMedia = await handleMultipleUpload(
          imageAssets,
          albumId?.toString(),
        );

        // Show success message
        Alert.alert(
          'Upload Complete',
          `Successfully uploaded ${uploadedMedia.length} images to the album.`,
        );
      } catch (err) {
        console.error('Failed to upload images:', err);
        Alert.alert(
          'Upload Failed',
          'There was an error uploading your images. Please try again.',
        );
      } finally {
        setIsUploading(false);
      }
    }
  }, []);

  // Toggle edit mode. Exiting edit mode clears the selection.
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (prev) setSelectedForDeletion(new Set());
      return !prev;
    });
  }, []);

  // Toggle a media item’s selection state for deletion
  const toggleSelectForDeletion = useCallback((uri: string) => {
    setSelectedForDeletion((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uri)) {
        newSet.delete(uri);
      } else {
        newSet.add(uri);
      }
      return newSet;
    });
  }, []);

  // Delete all selected images (from userImages and albumMedia)
  const handleDeleteSelected = useCallback(() => {
    if (selectedForDeletion.size === 0) return;
    Alert.alert(
      'Delete Selected Images',
      'Are you sure you want to delete the selected images?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUserImages((prev) =>
              prev.filter((img) => !selectedForDeletion.has(img.uri)),
            );
            setAlbumMedia((prev) =>
              prev.filter((img) => !selectedForDeletion.has(img.url)),
            );
            setSelectedForDeletion(new Set());
            setEditMode(false);
          },
        },
      ],
    );
  }, [selectedForDeletion]);

  // When an image is pressed:
  // • In edit mode, toggle its selection for deletion.
  // • Otherwise, open the preview modal.
  const handleImagePress = useCallback(
    (item: Media | ImagePicker.ImagePickerAsset) => {
      const uri = 'uri' in item ? item.uri : item.url;
      if (editMode) {
        toggleSelectForDeletion(uri);
      } else {
        setSelectedImage(item);
        setModalVisible(true);
      }
    },
    [editMode, toggleSelectForDeletion],
  );

  // --- Prepare Grid Data ---
  // The first cell is always "Add Photos" then comes user-added images and album media.
  // Empty placeholders fill the remaining cells.
  const gridData: GridDataItem[] = useMemo(() => {
    const allMedia = [...userImages, ...albumMedia];
    const placeholdersCount = Math.max(0, TOTAL_CELLS - (allMedia.length + 1));
    const placeholders: PlaceholderItem[] = Array.from(
      { length: placeholdersCount },
      () => ({ placeholder: true }),
    );
    return ['Add Photos', ...allMedia, ...placeholders];
  }, [userImages, albumMedia]);

  // --- Render Grid ---
  const renderGridItem = useCallback(
    ({ item }: { item: GridDataItem }) => {
      if (
        item === 'Add Photos' ||
        ('placeholder' in item && item.placeholder)
      ) {
        return (
          <GridItem
            item={item}
            onAddPhotos={handleAddPhotos}
            editMode={editMode}
            colors={colors}
          />
        );
      } else {
        // item is a media item
        const uri = 'uri' in item ? item.uri : item.url;
        const assetId = 'assetId' in item ? item.assetId : '';
        const selected = selectedForDeletion.has(uri);
        const progress =
          assetId && uploadProgress[assetId] ? uploadProgress[assetId] : 0;
        const isCurrentlyUploading =
          isUploading && progress > 0 && progress < 1;

        return (
          <GridItem
            item={item}
            onImagePress={() => handleImagePress(item)}
            editMode={editMode}
            selected={selected}
            toggleSelect={toggleSelectForDeletion}
            colors={colors}
            uploadProgress={progress}
            isUploading={isCurrentlyUploading}
          />
        );
      }
    },
    [
      colors,
      editMode,
      handleAddPhotos,
      handleImagePress,
      selectedForDeletion,
      toggleSelectForDeletion,
    ],
  );

  if (isLoading && !album) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={album!.name}
        username="anthonyaaronmcmillan"
        coverPhoto={album!.coverPhoto.url}
        onBack={router.back}
        onDeleteAlbum={handleDeleteAlbum}
        onToggleEdit={toggleEditMode}
        editMode={editMode}
        colors={colors}
      />
      <View style={{ paddingHorizontal: 8 }}>
        <FlatList
          data={gridData}
          renderItem={renderGridItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ padding: MARGIN / 2 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <AnimatedWrapper visible={editMode} animation="fade-in">
        <Footer
          selectedCount={selectedForDeletion.size}
          onDelete={handleDeleteSelected}
        />
      </AnimatedWrapper>

      {/* Modal Preview */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default AlbumDetailsScreen;
