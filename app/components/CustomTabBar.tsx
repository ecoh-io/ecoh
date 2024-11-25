import React, { useRef, useEffect, useContext } from 'react';
import { Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ScrollContext } from '@/src/context/ScrollContext';

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

  // Animated values for opacity and translateY
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isTabBarVisible ? 0 : 80, // Adjust slide distance as needed
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isTabBarVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isTabBarVisible, translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.animatedTabBar,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <BlurView tint="light" intensity={50} style={styles.blurView}>
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
          const scaleValue = useRef(new Animated.Value(1)).current;

          useEffect(() => {
            Animated.spring(scaleValue, {
              toValue: isFocused ? 1.2 : 1,
              useNativeDriver: true,
              friction: 4,
              tension: 160,
            }).start();
          }, [isFocused, scaleValue]);

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
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
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
      </BlurView>
    </Animated.View>
  );
};

export default CustomTabBar;

const { width } = Dimensions.get('window');

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
