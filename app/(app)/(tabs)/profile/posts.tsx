import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { posts } from '@/src/lib/data';
import Post from '@/src/components/post/Post';
import { PostType } from '@/src/types/post';
import { Tabs } from 'react-native-collapsible-tab-view';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80, // Consider item viewable when 80% visible
};

const keyExtractor = (item: any) => item.id.toString();

const PostsScreen: React.FC = () => {
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

  const handleAddMediaPost = () => {
    // TODO: Implement the logic to add a new media post
    console.log('Add new media post');
  };

  const EmptyState: React.FC = () => {
    const { colors } = useTheme();

    return (
      <View style={styles.emptyContainer}>
        <View
          style={[styles.iconBackground, { backgroundColor: colors.highlight }]}
        >
          <MaterialCommunityIcons name="note" size={32} color={colors.text} />
        </View>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Create Your First Post
        </Text>
        <Text style={[styles.subText, { color: colors.text }]}>
          Share your thoughts, ideas, and experiences with the community
        </Text>
      </View>
    );
  };

  return (
    <Tabs.FlashList
      data={undefined}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={300}
      scrollEventThrottle={16}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      ListEmptyComponent={EmptyState}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    flexDirection: 'column',
    gap: 10,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
    textAlign: 'center',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subText: {
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.medium,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: '80%',
  },
});

export default PostsScreen;
