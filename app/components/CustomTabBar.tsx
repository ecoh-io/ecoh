import React, { useEffect, useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ScrollContext } from '@/src/context/ScrollContext';
import { useTheme } from '@/src/theme/ThemeContext';

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

  // Shared values for opacity and translateY
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

          // Retrieve icon names based on route and focus state
          const iconNames = ICONS[route.name] || {
            focused: 'ellipse',
            unfocused: 'ellipse-outline',
          };

          // Animation for scaling the icon when focused
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
              <Animated.View style={[iconAnimatedStyle]}>
                {isFocused ? (
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

    // Removed borderRadius for sharp corners
    // borderRadius: 40,

    // Shadow adjustments for subtlety
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Reduced offset
    shadowOpacity: 0.05, // Very subtle opacity
    shadowRadius: 3, // Slight spread

    // Subtle Shadow for Android
    elevation: 2, // Lower elevation for softer shadow

    backgroundColor: 'rgba(255, 255, 255, 1)', // Fully opaque background
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
});
