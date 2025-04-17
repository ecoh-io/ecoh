// src/screens/FeedScreen.tsx

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { posts } from '@/src/lib/data';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { debounce } from 'lodash';
import { PostData, PostType } from '@/src/types/post';

import { MediaType } from '@/src/enums/media-type.enum';
import { Post } from '@/src/components/organisms/Posts';
import { withFeedManager } from '@/src/hoc/withFeedManger';

// Extra props provided by the feed manager HOC
// Production-level constants
const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 90;
const CONTENT_PADDING_TOP = HEADER_HEIGHT + 10;

export interface FeedScreenProps {
  videoRefs: React.MutableRefObject<{ [key: number]: any }>;
  onViewableItemsChanged: (info: {
    viewableItems: any[];
    changed: any[];
  }) => void;
  viewabilityConfig: { itemVisiblePercentThreshold: number };
  loading?: boolean;
  estimatedItemHeight?: number;
}

const FeedScreen: React.FC<FeedScreenProps> = ({
  videoRefs,
  onViewableItemsChanged,
  viewabilityConfig,
  loading = false,
  estimatedItemHeight = 300,
}) => {
  const { colors } = useTheme();
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  // Use a ref so that our renderItem always refers to the latest value without re-rendering
  const currentVisibleIndexRef = useRef(currentVisibleIndex);

  // Debounce updates to reduce excessive state changes
  const updateVisibleIndexDebounced = useMemo(
    () =>
      debounce((index: number) => {
        setCurrentVisibleIndex(index);
        currentVisibleIndexRef.current = index;
      }, 50),
    [],
  );

  // Shared values for header animation on the UI thread
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  // High-performance scroll handler using Reanimated worklets
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      // Immediate UI updates with no duration to avoid lag
      headerTranslateY.value = -Math.min(offsetY, HEADER_HEIGHT);
      headerOpacity.value = 1 - Math.min(offsetY / HEADER_HEIGHT, 1);
    },
  });

  // Combined onViewableItemsChanged: throttle state updates and use a robust "most visible" logic.
  const combinedOnViewableItemsChanged = useCallback(
    (info: { viewableItems: any[]; changed: any[] }) => {
      onViewableItemsChanged(info);
      if (info.viewableItems.length > 0) {
        // Choose the item with the highest "visibility" percentage (if provided by your viewability config)
        const mostVisible = info.viewableItems.reduce((prev, curr) =>
          (curr?.percentage ?? 0) > (prev?.percentage ?? 0) ? curr : prev,
        );
        if (
          mostVisible?.index !== undefined &&
          mostVisible.index !== currentVisibleIndexRef.current
        ) {
          updateVisibleIndexDebounced(mostVisible.index);
        }
      }
    },
    [onViewableItemsChanged, updateVisibleIndexDebounced],
  );

  // Dynamic item height measurement with a fallback estimated height.
  const [itemHeights, setItemHeights] = useState<{ [key: string]: number }>({});
  const updateItemHeight = useCallback((id: string, newHeight: number) => {
    setItemHeights((prev) => {
      // If there's no change, return the same object => no re-render
      if (prev[id] === newHeight) {
        return prev;
      }
      return {
        ...prev,
        [id]: newHeight,
      };
    });
  }, []);

  const getItemLayout = useCallback(
    (data: any, index: number) => {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += itemHeights[data[i].id] ?? estimatedItemHeight;
      }
      const length = itemHeights[data[index].id] ?? estimatedItemHeight;
      return { length, offset, index };
    },
    [itemHeights, estimatedItemHeight],
  );

  // Memoized renderItem to avoid unnecessary re-renders
  const renderItem = useCallback(
    ({ item, index }: { item: PostData; index: number }) => (
      <Post
        post={item}
        isAutoplay={
          index === currentVisibleIndexRef.current &&
          item.type === PostType.MEDIA &&
          item.media.some((m) => m.type === MediaType.VIDEO)
        }
        registerVideoRef={
          item.type === PostType.MEDIA &&
          item.media.some((m) => m.type === MediaType.VIDEO)
            ? (ref: any) => {
                videoRefs.current[index] = ref;
              }
            : undefined
        }
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          updateItemHeight(item.id, height); // now conditionally sets state
        }}
      />
    ),
    [videoRefs, updateItemHeight],
  );

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated header with pointerEvents adjusted to pass touches through */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: colors.background },
          animatedHeaderStyle,
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.headerContent} pointerEvents="auto">
          <Text style={[styles.title, { color: colors.text }]}>{'Feed'}</Text>
          <TouchableOpacity
            accessibilityLabel="Filter options"
            accessibilityHint="Opens filter options"
            onPress={() => {
              // Implement production-grade filter functionality
            }}
          >
            <MaterialCommunityIcons
              name="filter-variant"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Loading indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loadingIndicator}
        />
      )}

      <Animated.FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onViewableItemsChanged={combinedOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={posts.length > 0 ? getItemLayout : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: HEADER_HEIGHT,
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { paddingTop: HEADER_HEIGHT + 10, paddingBottom: 20 },
  loadingIndicator: { marginTop: HEADER_HEIGHT + 20 },
});

export default withFeedManager(FeedScreen);
