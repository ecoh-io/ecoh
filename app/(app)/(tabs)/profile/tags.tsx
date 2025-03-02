import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { PostType } from '@/src/types/post';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'react-native-collapsible-tab-view';
import Post from '@/src/components/Posts/Post';

const TagsScreen: React.FC = () => {
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
          index === currentVisibleIndex && item.type === PostType.MEDIA
        }
      />
    ),
    [currentVisibleIndex],
  );

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

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
          <MaterialCommunityIcons name="tag" size={32} color={colors.text} />
        </View>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Explore Tagged Content
        </Text>
        <Text style={[styles.subText, { color: colors.text }]}>
          Discover posts where you've been mentioned or tagged
        </Text>
      </View>
    );
  };

  return (
    <Tabs.FlashList
      data={undefined}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={300} // Provide an estimated item size
      removeClippedSubviews={true}
      scrollEventThrottle={16}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      nestedScrollEnabled
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

export default TagsScreen;
