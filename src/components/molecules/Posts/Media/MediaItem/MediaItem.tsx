import React, { memo, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './styles';
import { MediaItemProps } from './types';
import MediaVideoItem from '../MediaVideoItem';

const MediaItem: React.FC<MediaItemProps> = ({
  item,
  isAutoplay = true,
  onVideoRefReady,
}) => {
  const [loading, setLoading] = useState(item.type === 'image');
  const [error, setError] = useState(false);

  const handleLoadEnd = useCallback(() => setLoading(false), []);
  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  if (item.type === 'video') {
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
        <View style={styles.errorPlaceholder} />
      ) : (
        <Image
          source={{ uri: item.url }}
          style={styles.media}
          contentFit="cover"
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          accessibilityLabel="Gallery Image"
        />
      )}
    </View>
  );
};

export default memo(MediaItem, (prev, next) => {
  return prev.item.url === next.item.url && prev.item.type === next.item.type;
});
