// ProfileTabBar.tsx
import React, { useState, useEffect, memo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

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

  // State to store layout measurements for each tab (by index)
  const [layouts, setLayouts] = useState<
    Array<{ x: number; width: number } | null>
  >(new Array(TABS.length).fill(null));

  // Use Reanimated shared values for the pill's horizontal position and width.
  const pillAnimX = useSharedValue(0);
  const pillAnimWidth = useSharedValue(0);

  // When currentIndex or measured layouts change, animate the pill to match the active tab.
  useEffect(() => {
    const layout = layouts[currentIndex];
    if (layout) {
      pillAnimX.value = withTiming(layout.x, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
      pillAnimWidth.value = withTiming(layout.width, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [currentIndex, layouts, pillAnimX, pillAnimWidth]);

  // Compute the animated style for the pill based on our shared values.
  const pillAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: pillAnimX.value,
      width: pillAnimWidth.value,
    };
  });

  // Capture layout measurements for each tab.
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
      {/* Animated pill background positioned absolutely behind the tab text.
          We wrap the pill background with AnimatedWrapper. Since the pill is always visible,
          we pass visible={true} and use a zero-duration "fade-in" so that our externally computed
          animated style (pillAnimatedStyle) is applied without additional mount animations. */}
      <AnimatedWrapper
        visible={true}
        animation="fade-in"
        duration={0}
        style={[styles.animatedPill, pillAnimatedStyle]}
      >
        <></>
      </AnimatedWrapper>

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
  // Each tab item is centered and has some horizontal padding.
  tabItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    zIndex: 1, // ensures text is rendered on top of the animated pill
  },
  // The animated pill background is positioned absolutely behind the tabs.
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
    textAlign: 'center',
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
