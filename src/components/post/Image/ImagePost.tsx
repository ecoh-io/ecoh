import React, { useState, useCallback, memo, useMemo } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import { ImagePost, MediaContent } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext';
import PaginationIndicator from '../PaginationIndicator';

interface ImagePostProps {
  post: ImagePost;
}

interface ImageItemProps {
  item: MediaContent;
  itemWidth: number;
  itemHeight: number;
}

const ImageItem: React.FC<ImageItemProps> = memo(
  ({ item, itemWidth, itemHeight }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoadEnd = useCallback(() => setLoading(false), []);
    const handleError = useCallback(() => {
      setLoading(false);
      setError(true);
    }, []);

    return (
      <View
        style={[
          styles.imageItemContainer,
          { width: itemWidth - 20, height: itemHeight },
        ]}
      >
        {loading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color="#ffffff"
            accessibilityLabel="Loading image"
          />
        )}
        {error ? (
          // Fallback placeholder image in case of an error
          <></>
        ) : (
          <Image
            source={{ uri: item.uri }}
            style={[
              styles.galleryImage,
              { width: itemWidth, height: itemHeight },
            ]}
            contentFit="cover"
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            accessibilityLabel="Gallery Image"
          />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.item.uri === nextProps.item.uri,
);

const ImagePostComponent: React.FC<ImagePostProps> = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { images } = post;

  // Full width and square aspect ratio
  const itemWidth = useMemo(() => width, [width]);
  const itemHeight = useMemo(() => width, [width]);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.imageContainer,
          { width, height: itemHeight, backgroundColor: colors.background },
        ]}
      >
        <View style={styles.carouselWrapper}>
          {images.length === 1 ? (
            <ImageItem
              item={images[0]}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
            />
          ) : images.length > 1 ? (
            <Carousel
              width={itemWidth}
              height={itemHeight}
              data={images}
              snapEnabled={true}
              pagingEnabled={true}
              scrollAnimationDuration={300}
              onSnapToItem={(index: number) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <ImageItem
                  item={item}
                  itemWidth={itemWidth}
                  itemHeight={itemHeight}
                />
              )}
              style={{
                width: itemWidth,
                height: itemHeight,
              }}
              loop={false}
            />
          ) : null}
        </View>
      </View>
      {images.length > 1 && (
        <PaginationIndicator
          count={images.length}
          currentIndex={currentIndex}
          color={colors.secondary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 14,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  carouselWrapper: {
    flex: 1,
  },
  imageItemContainer: {
    overflow: 'hidden',
    borderRadius: 32,
    width: '100%',
    height: '100%',
    marginHorizontal: 10,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -25 }],
  },
});

export default memo(
  ImagePostComponent,
  (prevProps, nextProps) =>
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.images.length === nextProps.post.images.length &&
    prevProps.post.images.every(
      (img, index) => img.uri === nextProps.post.images[index].uri,
    ),
);
