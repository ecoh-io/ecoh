import React, { useRef, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Post, { PostType } from '../../src/components/post/Post';
import { PostData } from '@/src/types/post';

interface VideoFeedProps {
  posts: PostData[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ posts }) => {
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80, // Consider item viewable when 80% visible
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const visibleIndex = viewableItems[0].index;
        if (
          visibleIndex !== null &&
          visibleIndex !== undefined &&
          visibleIndex !== currentVisibleIndex
        ) {
          setCurrentVisibleIndex(visibleIndex);
        }
      }
    },
  ).current;

  const renderItem = useCallback(
    ({ item, index }: { item: PostData; index: number }) => (
      <Post
        post={item}
        isAutoplay={
          index === currentVisibleIndex && item.type === PostType.VIDEO
        }
      />
    ),
    [currentVisibleIndex],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Optional: Background color for the feed
  },
});

export default VideoFeed;
