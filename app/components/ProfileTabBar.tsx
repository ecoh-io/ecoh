import React, { useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/theme/ThemeContext';

// Define the type for each tab, including outline icon names
type Tab = {
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // Solid icon
  iconOutline: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // Outline icon
};

// Define the props for the ProfileTabBar component
type ProfileTabBarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

// Define the tabs with both solid and outline icons
const TABS: Tab[] = [
  {
    name: 'Posts',
    icon: 'file-document',
    iconOutline: 'file-document-outline',
  },
  {
    name: 'Images',
    icon: 'image-multiple',
    iconOutline: 'image-multiple-outline',
  },
  { name: 'Bookmarks', icon: 'bookmark', iconOutline: 'bookmark-outline' },
];

// Define a constant for the indicator width
const INDICATOR_WIDTH = 48; // Adjust this value to make the indicator wider or narrower

const ProfileTabBar: React.FC<ProfileTabBarProps> = React.memo(
  ({ activeTab, setActiveTab }) => {
    // Get current window dimensions
    const { width: screenWidth } = useWindowDimensions();

    // Calculate the width of each tab
    const tabWidth = screenWidth / TABS.length;

    // Animated value for the tab indicator's translateX
    const indicatorPosition = useRef(new Animated.Value(0)).current;

    // Ref to track initial mount
    const isInitialMount = useRef(true);

    // Set initial position using useLayoutEffect
    useLayoutEffect(() => {
      const index = TABS.findIndex((tab) => tab.name === activeTab);
      if (index !== -1) {
        const initialValue =
          index * tabWidth + tabWidth / 2 - INDICATOR_WIDTH / 2;
        indicatorPosition.setValue(initialValue);
      }
    }, [activeTab, tabWidth, indicatorPosition]);

    // Animate position when activeTab or tabWidth changes, skipping initial mount
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      const index = TABS.findIndex((tab) => tab.name === activeTab);
      if (index !== -1) {
        const toValue = index * tabWidth + tabWidth / 2 - INDICATOR_WIDTH / 2;
        Animated.spring(indicatorPosition, {
          toValue,
          useNativeDriver: true,
          friction: 6, // Adjust for desired smoothness
          tension: 100, // Adjust for desired responsiveness
        }).start();
      }
    }, [activeTab, tabWidth, indicatorPosition]);

    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <Pressable
                key={tab.name}
                style={[styles.tabItem, { width: tabWidth }]}
                onPress={() => setActiveTab(tab.name)}
                accessibilityLabel={tab.name}
                accessibilityRole="button"
                android_ripple={{
                  color: 'rgba(0,0,0,0.1)',
                  borderless: true,
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isActive && styles.activeShadow,
                  ]}
                >
                  {isActive ? (
                    // Active Tab: Solid Icon with Gradient Fill
                    <MaskedView
                      maskElement={
                        <MaterialCommunityIcons
                          name={tab.icon}
                          size={28}
                          color="black"
                        />
                      }
                    >
                      <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                      />
                      {/* Fallback View to ensure gradient fills the mask */}
                      <View style={styles.gradientOverlay} />
                    </MaskedView>
                  ) : (
                    // Inactive Tab: Outline Icon
                    <MaterialCommunityIcons
                      name={tab.iconOutline}
                      size={28}
                      color={'#828282'}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
          {/* Sliding Tab Indicator with Gradient */}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: indicatorPosition }],
              },
            ]}
            pointerEvents="none" // Ensure indicator doesn't intercept touch events
          >
            <MaskedView maskElement={<View style={styles.indicatorMask} />}>
              <LinearGradient
                colors={['#00c6ff', '#0072ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.indicatorGradient}
              />
            </MaskedView>
          </Animated.View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 60, // Compact height for the tab bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Changed from 'space-around' for accurate positioning
    alignItems: 'center',
    width: '100%', // Ensure it takes the full width of the container
    height: '100%',
    position: 'relative', // Important for absolute positioning of indicator
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeShadow: {
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  gradient: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
    zIndex: -1,
    width: INDICATOR_WIDTH, // Indicator width matches the mask and gradient
  },
  indicatorMask: {
    width: INDICATOR_WIDTH,
    height: 3,
    backgroundColor: 'black',
    borderRadius: 1.5,
  },
  indicatorGradient: {
    width: INDICATOR_WIDTH,
    height: 3,
    borderRadius: 1.5,
  },
});

export default ProfileTabBar;
