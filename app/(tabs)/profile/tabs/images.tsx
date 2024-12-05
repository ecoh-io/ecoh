import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { posts } from '@/src/lib/data';
import Post from '@/src/components/post/Post';
import { PostType } from '@/src/types/post';
import { FlashList } from '@shopify/flash-list';

const ImageScreen: React.FC = () => {
  const { colors } = useTheme();

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0); // Track current visible post index

  // onViewableItemsChanged callback to determine which post is visible
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0];
        if (visibleItem.index !== null && visibleItem.index !== undefined) {
          setCurrentVisibleIndex(visibleItem.index);
        }
      }
    },
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80, // Consider item viewable when 80% visible
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <Post
        post={item}
        isAutoplay={
          index === currentVisibleIndex && item.type === PostType.VIDEO
        }
      />
    ),
    [currentVisibleIndex],
  );

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={300} // Provide an estimated item size
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ImageScreen;
