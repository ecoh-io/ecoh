import React, { useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

// Define your icon mappings based on route names
const ICONS: Record<
  string,
  {
    focused: keyof typeof MaterialCommunityIcons.glyphMap;
    unfocused: keyof typeof MaterialCommunityIcons.glyphMap;
  }
> = {
  dashboard: {
    focused: 'view-dashboard',
    unfocused: 'view-dashboard-outline',
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
  return (
    <BlurView tint="light" intensity={50} style={styles.tabBar}>
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
        }, [isFocused]);

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
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    marginHorizontal: 20,
    marginBottom: 25,
    height: 65,
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent for blur effect
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
