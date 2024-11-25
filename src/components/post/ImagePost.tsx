import React, { useState, useCallback, useRef, memo, useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  AccessibilityProps,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ImagePost, MediaContent } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext';
import AnimatedHeart from './AnimatedHeart';
import PaginationIndicator from './PaginationIndicator';

interface ImagePostProps {
  post: ImagePost;
  onDoubleTap: () => void;
}

const DOUBLE_TAP_DELAY = 300; // milliseconds

interface ImageItemProps {
  item: MediaContent;
  itemWidth: number;
  itemHeight: number;
}

const ImageItem: React.FC<ImageItemProps> = memo(
  ({ item, itemWidth, itemHeight }) => {
    const [loading, setLoading] = useState(true);

    const handleLoadEnd = useCallback(() => {
      setLoading(false);
    }, []);

    const handleError = useCallback(() => {
      setLoading(false);
      // Optionally, you can set an error state here to show a fallback image or message
    }, []);

    return (
      <View
        style={[
          styles.imageItemContainer,
          { width: itemWidth, height: itemHeight },
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
        <Image
          source={{ uri: item.uri }}
          style={[
            styles.galleryImage,
            {
              width: itemWidth, // Adjust width dynamically
              height: itemHeight, // Adjust height dynamically
            },
          ]}
          accessibilityLabel="Gallery Image"
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.item === nextProps.item,
);

const ImagePostComponent: React.FC<ImagePostProps> = ({
  post,
  onDoubleTap,
}) => {
  const [showHeart, setShowHeart] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const lastTap = useRef<number>(0);

  const { images } = post;

  // Determine if the post has a single image
  const isSingleImage = images.length === 1;
  const itemWidth = useMemo(() => width * 0.94, [width]); // 94% of screen width
  const itemHeight = useMemo(() => width, [width]); // Adjust height based on image count

  // Handler for double-tap gesture
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      onDoubleTap();
      setShowHeart(true);
      lastTap.current = 0; // Reset after double-tap
    } else {
      lastTap.current = now;
    }
  }, [onDoubleTap]);

  // Handler to hide the heart after animation completes
  const handleAnimationComplete = useCallback(() => {
    setShowHeart(false);
  }, []);

  // Memoized gesture handler to prevent re-creation on each render
  const doubleTapGesture = useMemo(() => handleDoubleTap, [handleDoubleTap]);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.imageContainer,
          { width, height: itemHeight, backgroundColor: colors.background },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={doubleTapGesture}
          accessibilityLabel="Double-tap to like"
          accessibilityRole="button"
        >
          <View style={styles.carouselWrapper}>
            {images.length > 0 && (
              <Carousel
                width={itemWidth}
                height={itemHeight}
                data={images}
                scrollAnimationDuration={500}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item }) => (
                  <ImageItem
                    item={item}
                    itemWidth={itemWidth}
                    itemHeight={itemHeight}
                  />
                )}
                style={{
                  overflow: 'visible', // Adjust overflow for single image
                  marginHorizontal: isSingleImage ? 12 : 0,
                  marginVertical: isSingleImage ? 12 : 0,
                }}
                mode={isSingleImage ? undefined : 'parallax'} // Disable parallax for single image
                modeConfig={
                  !isSingleImage
                    ? {
                        parallaxScrollingScale: 0.95,
                        parallaxScrollingOffset: 15,
                      }
                    : undefined
                }
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                customConfig={() => ({
                  type: 'positive',
                  viewCount: 1,
                })}
                loop={false} // Disable looping for single image
                pagingEnabled={true}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {showHeart && (
          <AnimatedHeart
            visible={showHeart}
            onAnimationComplete={handleAnimationComplete}
          />
        )}
        {images.length > 1 && (
          <PaginationIndicator
            count={images.length}
            currentIndex={currentIndex}
            color={colors.secondary}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden', // Ensure child elements don't overflow
    borderRadius: 0, // Optional: Add border radius if desired
  },
  carouselWrapper: {
    flex: 1,
  },
  imageItemContainer: {
    flex: 1,
    shadowColor: '#000', // Dark shadow color
    shadowOffset: { width: 0, height: 4 }, // Slight lift
    shadowOpacity: 0.25, // Balanced opacity for a subtle shadow
    shadowRadius: 10, // Larger radius for a smoother shadow
    elevation: 12, // High elevation for Android
    borderRadius: 32, // Match imageContainer's border radius
    marginBottom: 20, // Space below each image
    backgroundColor: '#fff', // Solid white background
    overflow: 'hidden', // Prevent shadow bleed with borderRadius
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Preserve aspect ratio
    borderRadius: 32, // Match the container’s rounded corners
    backgroundColor: 'lightgray',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center', // Center the loader
  },
});

export default memo(
  ImagePostComponent,
  (prevProps, nextProps) =>
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.images === nextProps.post.images,
);
