import React, { useState, useCallback, useRef, memo, useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ImagePost, MediaContent } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext';
import AnimatedHeart from '../Animated/AnimatedHeart';
import PaginationIndicator from '../PaginationIndicator';

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

  const itemWidth = useMemo(() => width, [width]); // Full screen width
  const itemHeight = useMemo(() => width, [width]); // Square aspect ratio

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

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.imageContainer,
          { width, height: itemHeight, backgroundColor: colors.background },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={handleDoubleTap}
          accessibilityLabel="Double-tap to like"
          accessibilityRole="button"
        >
          <View style={styles.carouselWrapper}>
            {images.length === 1 ? (
              // Render single image without Carousel
              <ImageItem
                item={images[0]}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
              />
            ) : images.length > 1 ? (
              // Render Carousel for multiple images
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
                  overflow: 'visible',
                }}
                mode={'horizontal-stack'} // Changed to 'horizontal-snap' for better single-item handling
                modeConfig={{
                  snapDirection: 'left',
                }}
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                customConfig={() => ({
                  type: 'positive',
                  viewCount: 1,
                })}
                loop={false} // Disable looping
                pagingEnabled={true}
              />
            ) : null}
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
    backgroundColor: '#000', // Dark background for better contrast
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
    backgroundColor: '#000', // Solid black background for better image contrast
    overflow: 'hidden', // Prevent shadow bleed with borderRadius
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 32,
  },

  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Preserve aspect ratio
    backgroundColor: 'lightgray',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center', // Center the loader
    top: '50%',
    transform: [{ translateY: -25 }],
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
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
