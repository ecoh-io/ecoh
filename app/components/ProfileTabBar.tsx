import React, { useRef, useEffect, useState, memo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

type Tab = { name: string };

const TABS: Tab[] = [
  { name: 'Posts' },
  { name: 'Media' },
  { name: 'Tagged' },
  { name: 'Saved' },
];

interface ProfileTabBarProps {
  currentIndex: number;
  onTabPress: (index: number) => void;
}

const ProfileTabBar: React.FC<ProfileTabBarProps> = ({
  currentIndex,
  onTabPress,
}) => {
  const { colors } = useTheme();

  // Array to store layout measurements for each tab (by index)
  const [layouts, setLayouts] = useState<
    Array<{ x: number; width: number } | null>
  >(new Array(TABS.length).fill(null));

  // Animated values for the pill's horizontal position and width
  const pillAnimX = useRef(new Animated.Value(0)).current;
  const pillAnimWidth = useRef(new Animated.Value(0)).current;

  // When currentIndex or measured layouts change, animate the pill to match the active tab
  useEffect(() => {
    const layout = layouts[currentIndex];
    if (layout) {
      Animated.parallel([
        Animated.spring(pillAnimX, {
          toValue: layout.x,
          tension: 300,
          friction: 20,
          useNativeDriver: false, // 'left' and 'width' cannot use native driver
        }),
        Animated.spring(pillAnimWidth, {
          toValue: layout.width,
          tension: 300,
          friction: 20,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [currentIndex, layouts, pillAnimX, pillAnimWidth]);

  // Capture layout measurements for each tab
  const onTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  return (
    <View
      style={[styles.tabBarContainer, { backgroundColor: colors.background }]}
    >
      {/* Animated pill background positioned absolutely behind the tab text */}
      <Animated.View
        style={[
          styles.animatedPill,
          {
            left: pillAnimX,
            width: pillAnimWidth,
          },
        ]}
      />
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => {
          const isActive = index === currentIndex;
          return (
            <Pressable
              key={tab.name}
              onPress={() => onTabPress(index)}
              onLayout={onTabLayout(index)}
              style={styles.tabItem}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // left aligned
    alignItems: 'center',
  },
  // Each tab item has a fixed height with centered content so the text appears centered.
  tabItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center', // centers the text horizontally
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    zIndex: 1, // ensures text is rendered on top of the animated pill
  },
  // The animated pill background positioned behind the active tab
  animatedPill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 40,
    backgroundColor: '#e6f0ff', // adjust as needed
    borderRadius: 20,
    zIndex: 0,
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center', // ensure text is centered within the Pressable
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  activeTabText: {
    color: '#0072ff', // blue for active tab
  },
  inactiveTabText: {
    color: '#000000', // black for inactive tabs
  },
});

export default memo(ProfileTabBar);
