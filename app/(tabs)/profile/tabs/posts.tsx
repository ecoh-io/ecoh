import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { posts } from '@/src/lib/data';
import Post from '@/src/components/post/Post';
import { PostType } from '@/src/types/post';
import { FlashList } from '@shopify/flash-list';
import { useIsFocused } from '@react-navigation/native';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80, // Consider item viewable when 80% visible
};

const keyExtractor = (item: any) => item.id.toString();

const PostsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0];
        if (visibleItem.index != null) {
          setCurrentVisibleIndex(visibleItem.index);
        }
      }
    },
    [],
  );

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={300}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        nestedScrollEnabled
        scrollEnabled
        contentContainerStyle={{ padding: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PostsScreen;
