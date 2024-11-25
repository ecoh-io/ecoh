import React, { useRef, useCallback, useContext, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  Text,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { ScrollContext } from '@/src/context/ScrollContext';
import Post, { PostType } from '@/src/components/post/Post';
import { posts } from '@/src/lib/data';
import { throttle } from 'lodash';

const HEADER_HEIGHT = 60;
const SCROLL_THRESHOLD = 20; // Increased threshold to require more significant scroll
const ANIMATION_DURATION = 200;
const TAB_BAR_HEIGHT = 90;
const CONTENT_PADDING_TOP = HEADER_HEIGHT + 10;

const FeedScreen: React.FC = () => {
  const { colors } = useTheme();
  const { setTabBarVisible } = useContext(ScrollContext);

  // Animated values for header
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  // Refs to track previous scroll and state
  const prevScrollY = useRef(0);
  const headerVisible = useRef(true);
  const isAnimating = useRef(false); // Flag to prevent overlapping animations

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0); // Track current visible post index

  const animateHeader = useCallback(
    (toValueOpacity: number, toValueTranslateY: number, visible: boolean) => {
      if (isAnimating.current) return; // Prevent starting a new animation if one is in progress

      isAnimating.current = true; // Set the animation flag

      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: toValueOpacity,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: toValueTranslateY,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        headerVisible.current = visible;
        setTabBarVisible(visible);
        isAnimating.current = false; // Reset the animation flag
      });
    },
    [headerOpacity, headerTranslateY, setTabBarVisible],
  );

  // Throttled scroll handler accepting currentScrollY as a primitive value
  const throttledHandleScroll = useCallback(
    throttle((currentScrollY: number) => {
      const deltaY = currentScrollY - prevScrollY.current;

      if (deltaY > SCROLL_THRESHOLD && headerVisible.current) {
        // User scrolled down significantly - hide header and tab bar
        animateHeader(0, -HEADER_HEIGHT, false);
      } else if (deltaY < -SCROLL_THRESHOLD && !headerVisible.current) {
        // User scrolled up significantly - show header and tab bar
        animateHeader(1, 0, true);
      }

      prevScrollY.current = currentScrollY;
    }, 100), // Throttled to execute once every 100ms
    [animateHeader],
  );

  // Updated handleScroll to extract currentScrollY synchronously
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      throttledHandleScroll(currentScrollY);
    },
    [throttledHandleScroll],
  );

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
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.background, // Use theme color
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{'Feed'}</Text>
        <TouchableOpacity
          accessibilityLabel="Filter options"
          accessibilityHint="Opens filter options"
          onPress={() => {
            // Implement your filter functionality here
          }}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Feed Content */}
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21} // Increased window size for smoother scrolling
        removeClippedSubviews={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute', // Fixed at the top
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000, // Ensure the header is above other content
  },
  title: {
    fontFamily: typography.Poppins.medium,
    fontSize: 22,
  },
  content: {
    paddingTop: CONTENT_PADDING_TOP - 10, // Space below the header
    paddingBottom: TAB_BAR_HEIGHT, // Extra space to prevent content from being hidden behind the tab bar
  },
});

export default FeedScreen;
