import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useNavigationState } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // Access the entire navigation state
  const navigationState = useNavigationState((state) => state);

  /**
   * Calculates the navigation depth for a given tab route.
   * @param route - The route object from the navigation state.
   * @returns The depth of the navigation stack for the route.
   */
  const getNavigationDepth = (route: any): number => {
    return route?.state?.routes?.length || 1;
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#ffffff', '#f0f0f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: 'transparent' }]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];

          // Determine the label for the tab
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // Check if the current route is focused
          const isFocused = state.index === index;

          // Handle the press event
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

          // Handle long press event (optional)
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Choose an icon based on route name (customize as needed)
          const getIconName = (
            routeName: string,
          ): keyof typeof MaterialIcons.glyphMap => {
            switch (routeName.toLowerCase()) {
              case 'dashboard':
                return 'dashboard';
              case 'feed':
                return 'search';
              case 'search':
                return 'notifications';
              case 'profile':
                return 'person';
              default:
                return 'circle';
            }
          };

          // Animation values
          const scale = useSharedValue(1);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
          }));

          const handlePressIn = () => {
            scale.value = withSpring(1.2, { damping: 10 });
          };

          const handlePressOut = () => {
            scale.value = withSpring(1, { damping: 10 });
          };

          // Get the route object to calculate depth
          const currentRoute = navigationState.routes[index];
          const depth = getNavigationDepth(currentRoute);

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              android_ripple={{ color: '#ccc', borderless: true }}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.touchable}
              >
                <Animated.View style={[styles.iconContainer, animatedStyle]}>
                  <MaterialIcons
                    name={getIconName(route.name)}
                    size={24}
                    color={isFocused ? '#673ab7' : '#222'}
                  />
                  {/* Navigation depth indicator */}
                  {isFocused && depth > 1 && (
                    <View style={styles.depthIndicator}>
                      <Text style={styles.depthText}>{depth - 1}</Text>
                    </View>
                  )}
                </Animated.View>
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? '#673ab7' : '#222' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </Pressable>
          );
        })}
      </View>

      {/* Central Floating Action Button (FAB) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => {
            // Define FAB action here
            navigation.navigate('create-post');
          }}
          style={styles.fab}
          activeOpacity={0.7}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  gradient: ViewStyle;
  tabBar: ViewStyle;
  tab: ViewStyle;
  touchable: ViewStyle;
  iconContainer: ViewStyle;
  label: TextStyle;
  depthIndicator: ViewStyle;
  depthText: TextStyle;
  fabContainer: ViewStyle;
  fab: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    // Removed overflow: 'hidden' to prevent clipping of FAB
    // overflow: 'hidden',
    // Added padding to ensure space for FAB
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent', // To allow gradient visibility
    // Shadows for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
    // zIndex to ensure FAB is on top
    zIndex: 10,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  depthIndicator: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depthText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    top: -30, // Adjust based on FAB size
    alignSelf: 'center',
    // Increase zIndex to ensure FAB is above the tab bar
    zIndex: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#673ab7',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadows for iOS
    shadowColor: '#673ab7',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
});

export default React.memo(CustomTabBar);
