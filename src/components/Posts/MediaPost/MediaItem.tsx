// src/components/MediaPost/MediaItem.tsx
import React, { memo, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import MediaVideoItem from './MediaVideoItem';
import { Media } from '@/src/types/Media';
import { styles } from './styles';

interface MediaItemProps {
  item: Media;
  itemWidth: number;
  itemHeight: number;
  isAutoplay?: boolean; // can pass down if you want autoplay for videos
  onVideoRefReady?: (videoRef: any) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  item,
  itemWidth,
  itemHeight,
  isAutoplay = true,
  onVideoRefReady,
}) => {
  // Only used for images:
  const [loading, setLoading] = useState(item.type === 'image');
  const [error, setError] = useState(false);

  const handleLoadEnd = useCallback(() => setLoading(false), []);
  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  if (item.type === 'video') {
    // Render video item
    return (
      <View style={styles.mediaItemContainer}>
        <MediaVideoItem
          uri={item.url}
          isAutoplay={isAutoplay}
          onVideoRefReady={onVideoRefReady}
        />
      </View>
    );
  }

  // Else, it's an image
  return (
    <View style={styles.mediaItemContainer}>
      {loading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#ffffff"
          accessibilityLabel="Loading image"
        />
      )}
      {error ? (
        // Fallback placeholder view or error image
        <View style={styles.errorPlaceholder} />
      ) : (
        <Image
          source={{ uri: item.url }}
          style={styles.media}
          contentFit="cover" // ensures the entire image fits
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          accessibilityLabel="Gallery Image"
        />
      )}
    </View>
  );
};

export default memo(MediaItem, (prev, next) => {
  // If the URI and type didn't change, no need to re-render
  return prev.item.url === next.item.url && prev.item.type === next.item.type;
});
