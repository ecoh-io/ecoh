import React, { useRef, useCallback, useContext } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { ScrollContext } from '@/src/context/ScrollContext';

const HEADER_HEIGHT = 60;
const SCROLL_THRESHOLD = 5;
const ANIMATION_DURATION = 200;

const FeedScreen: React.FC = () => {
  const { colors } = useTheme();
  const { setTabBarVisible } = useContext(ScrollContext);

  // Animated values for header
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const prevScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = React.useState(true);

  const animateHeader = useCallback(
    (toValueOpacity: number, toValueTranslateY: number, visible: boolean) => {
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
      ]).start(() => setHeaderVisible(visible));
    },
    [ANIMATION_DURATION, headerOpacity, headerTranslateY],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const deltaY = currentScrollY - prevScrollY.current;

      if (deltaY > SCROLL_THRESHOLD && headerVisible) {
        // User scrolled down - hide header and tab bar
        animateHeader(0, -HEADER_HEIGHT, false);
        setTabBarVisible(false);
      } else if (deltaY < -SCROLL_THRESHOLD && !headerVisible) {
        // User scrolled up - show header and tab bar
        animateHeader(1, 0, true);
        setTabBarVisible(true);
      }

      prevScrollY.current = currentScrollY;
    },
    [SCROLL_THRESHOLD, headerVisible, animateHeader, setTabBarVisible],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: colors.background || 'white',
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{'Feed'}</Text>
        <TouchableOpacity
          accessibilityLabel="Filter options"
          onPress={() => {
            // Implement your filter functionality here
          }}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color={'black'}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Replace with your actual feed content */}
        {Array.from({ length: 30 }).map((_, index) => (
          <View key={index} style={styles.item}>
            <Text style={[styles.itemText, { color: colors.text }]}>
              {`Item ${index + 1}`}
            </Text>
          </View>
        ))}
      </ScrollView>
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

    // Subtle Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Reduced offset
    shadowOpacity: 0.1, // Reduced opacity
    shadowRadius: 1.5, // Reduced radius

    // Subtle Shadow for Android
    elevation: 2, // Reduced elevation
  },
  title: {
    fontFamily: typography.Poppins.medium,
    fontSize: 22,
  },
  content: {
    paddingTop: HEADER_HEIGHT + 10, // Space below the header
    paddingHorizontal: 16,
    paddingBottom: 90, // Extra space to prevent content from being hidden behind the tab bar
  },
  item: {
    height: 80,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: typography.Poppins.regular,
    fontSize: 16,
  },
});

export default FeedScreen;
