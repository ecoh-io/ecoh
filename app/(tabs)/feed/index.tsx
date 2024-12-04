import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { ScrollContext } from '@/src/context/ScrollContext';
import Post, { PostType } from '@/src/components/post/Post';
import { posts } from '@/src/lib/data';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 60;
const SCROLL_THRESHOLD = 10;
const ANIMATION_DURATION = 200;
const TAB_BAR_HEIGHT = 90;
const CONTENT_PADDING_TOP = HEADER_HEIGHT + 10;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const keyExtractor = (item: any) => item.id.toString();

// Create an animated version of FlashList
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const FeedScreen: React.FC = () => {
  const { colors } = useTheme();
  const { setTabBarVisible } = useContext(ScrollContext);

  // Shared values for header animation
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  // Animated styles for the header
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  // Shared values for scroll handling
  const prevScrollY = useSharedValue(0);
  const headerVisible = useSharedValue(true);
  const isAnimating = useSharedValue(false);

  // Scroll handler using Reanimated's useAnimatedScrollHandler
  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const deltaY = currentScrollY - prevScrollY.value;

      if (
        deltaY > SCROLL_THRESHOLD &&
        headerVisible.value &&
        !isAnimating.value
      ) {
        isAnimating.value = true;
        headerOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
        headerTranslateY.value = withTiming(
          -HEADER_HEIGHT,
          { duration: ANIMATION_DURATION },
          () => {
            headerVisible.value = false;
            if (typeof setTabBarVisible === 'function') {
              runOnJS(setTabBarVisible)(false);
            } else {
              console.error('setTabBarVisible is not a function');
            }
            isAnimating.value = false;
          },
        );
      } else if (
        deltaY < -SCROLL_THRESHOLD &&
        !headerVisible.value &&
        !isAnimating.value
      ) {
        isAnimating.value = true;
        headerOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
        headerTranslateY.value = withTiming(
          0,
          { duration: ANIMATION_DURATION },
          () => {
            headerVisible.value = true;
            if (typeof setTabBarVisible === 'function') {
              runOnJS(setTabBarVisible)(true);
            } else {
              console.error('setTabBarVisible is not a function');
            }
            isAnimating.value = false;
          },
        );
      }

      prevScrollY.value = currentScrollY;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems.find((item) => item.index !== null);
        if (
          visibleItem?.index !== undefined &&
          visibleItem.index !== currentVisibleIndex
        ) {
          setCurrentVisibleIndex(visibleItem.index);
        }
      }
    },
    [currentVisibleIndex],
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
            },
            animatedHeaderStyle,
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
        <AnimatedFlashList
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.content}
          estimatedItemSize={300} // Adjust this value based on your item size
          onScroll={animatedScrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
    </GestureHandlerRootView>
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
    paddingTop: CONTENT_PADDING_TOP, // Space below the header
    paddingBottom: TAB_BAR_HEIGHT, // Extra space to prevent content from being hidden behind the tab bar
    flex: 1,
  },
});

export default FeedScreen;
