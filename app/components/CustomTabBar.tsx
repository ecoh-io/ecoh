import React, { useEffect, useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ScrollContext } from '@/src/context/ScrollContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';

// Define your icon mappings based on route names
const ICONS: Record<
  string,
  {
    focused: keyof typeof MaterialCommunityIcons.glyphMap;
    unfocused: keyof typeof MaterialCommunityIcons.glyphMap;
  }
> = {
  dashboard: {
    focused: 'home',
    unfocused: 'home-outline',
  },
  feed: {
    focused: 'newspaper-variant',
    unfocused: 'newspaper-variant-outline',
  },
  search: {
    focused: 'magnify',
    unfocused: 'magnify-minus-outline',
  },
  profile: { focused: 'account-circle', unfocused: 'account-circle-outline' },
  // Add more mappings as needed
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { isTabBarVisible } = useContext(ScrollContext);
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  // Use the user's profile photo URL; fallback to a default placeholder if needed.
  const profilePhoto =
    user?.profile.profilePictureUrl ||
    'https://example.com/default-profile.png';

  // Shared values for opacity and translateY for showing/hiding the tab bar.
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(isTabBarVisible ? 0 : 80, {
      duration: 200,
    });
    opacity.value = withTiming(isTabBarVisible ? 1 : 0, {
      duration: 200,
    });
  }, [isTabBarVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.animatedTabBar,
        animatedStyle,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.blurView}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label: string = options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Retrieve icon names based on route and focus state.
          const iconNames = ICONS[route.name] || {
            focused: 'ellipse',
            unfocused: 'ellipse-outline',
          };

          // Animation for scaling the icon or profile photo when focused.
          const scaleValue = useSharedValue(1);
          useEffect(() => {
            scaleValue.value = withTiming(isFocused ? 1.2 : 1, {
              duration: 300,
            });
          }, [isFocused]);

          const iconAnimatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scaleValue.value }],
          }));

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              onPress={onPress}
              style={styles.tabItem}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
            >
              <Animated.View style={iconAnimatedStyle}>
                {route.name.toLowerCase() === 'profile' ? (
                  // Render the user's profile photo.
                  isFocused ? (
                    // When active, wrap the profile image with a gradient border.
                    <LinearGradient
                      colors={['#00c6ff', '#0072ff']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.profileGradientBorder}
                    >
                      <View style={styles.profileImageContainer}>
                        <Image
                          source={{ uri: profilePhoto }}
                          style={styles.profileImage}
                        />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.inactiveProfileBorder}>
                      <Image
                        source={{ uri: profilePhoto }}
                        style={styles.profileImage}
                      />
                    </View>
                  )
                ) : // Render a regular icon for non-profile tabs.
                isFocused ? (
                  <MaskedView
                    maskElement={
                      <MaterialCommunityIcons
                        name={iconNames.focused}
                        size={24}
                        color="#000"
                      />
                    }
                  >
                    <LinearGradient
                      colors={['#00c6ff', '#0072ff']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientIconBackground}
                    />
                  </MaskedView>
                ) : (
                  <MaterialCommunityIcons
                    name={iconNames.unfocused}
                    size={24}
                    color="#828282"
                  />
                )}
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  animatedTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // Ensure full width
    height: 80, // Adjusted height to accommodate slide animation
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 15,
    // Shadow adjustments for subtlety
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  blurView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  gradientIconBackground: {
    width: 24,
    height: 24,
  },
  // Styles for the profile tab
  profileGradientBorder: {
    width: 34,
    height: 34,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveProfileBorder: {
    width: 34,
    height: 34,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#828282',
  },
  profileImageContainer: {
    width: 30,
    height: 30,
    borderRadius: 14,
    backgroundColor: '#fff', // Use your background color or colors.background
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
  },
});
