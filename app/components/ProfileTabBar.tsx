import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Tab = {
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconOutline: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const TABS: Tab[] = [
  {
    name: 'Posts',
    icon: 'post-outline',
    iconOutline: 'post-outline',
  },
  {
    name: 'Media',
    icon: 'image-multiple-outline',
    iconOutline: 'image-multiple-outline',
  },
  {
    name: 'Tags',
    icon: 'tag-outline',
    iconOutline: 'tag-outline',
  },
  {
    name: 'Saved',
    icon: 'bookmark-outline',
    iconOutline: 'bookmark-outline',
  },
];

const INDICATOR_HEIGHT = 3;

interface ProfileTabBarProps {
  currentIndex: number;
  onTabPress: (index: number) => void;
  tabBarWidth: number;
}

const ProfileTabBar: React.FC<ProfileTabBarProps> = React.memo(
  ({ currentIndex, onTabPress, tabBarWidth }) => {
    const tabWidth = useMemo(() => tabBarWidth / TABS.length, [tabBarWidth]);
    const indicatorWidth = useMemo(() => tabWidth * 0.5, [tabWidth]);

    const indicatorPosition = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (tabWidth > 0 && indicatorWidth > 0) {
        const toValue =
          currentIndex * tabWidth + (tabWidth - indicatorWidth) / 2;
        Animated.timing(indicatorPosition, {
          toValue,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }, [currentIndex, tabWidth, indicatorWidth]);

    return (
      <View style={styles.tabBarContainer}>
        <View
          style={styles.tabBar}
          onLayout={() => {
            // Layout is handled in the parent component
          }}
        >
          {TABS.map((tab, index) => {
            const isActive = currentIndex === index;

            return (
              <Pressable
                key={tab.name}
                style={[styles.tabItem, { width: tabWidth }]}
                onPress={() => onTabPress(index)}
                accessibilityLabel={tab.name}
                accessibilityRole="button"
                android_ripple={{
                  color: 'rgba(0,0,0,0.1)',
                  borderless: true,
                }}
              >
                <View style={styles.iconContainer}>
                  {isActive ? (
                    <MaskedView
                      maskElement={
                        <MaterialCommunityIcons
                          name={tab.icon}
                          size={26}
                          color="black"
                        />
                      }
                    >
                      <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 26, height: 26 }}
                      />
                      <View style={StyleSheet.absoluteFill} />
                    </MaskedView>
                  ) : (
                    <MaterialCommunityIcons
                      name={tab.iconOutline}
                      size={26}
                      color={'#828282'}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        {tabBarWidth > 0 && (
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: indicatorPosition }],
                width: indicatorWidth,
              },
            ]}
            pointerEvents="none"
          >
            <MaskedView
              maskElement={
                <View
                  style={{
                    width: indicatorWidth,
                    height: INDICATOR_HEIGHT,
                    backgroundColor: 'black',
                    borderRadius: INDICATOR_HEIGHT / 2,
                  }}
                />
              }
            >
              <LinearGradient
                colors={['#00c6ff', '#0072ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: indicatorWidth,
                  height: INDICATOR_HEIGHT,
                  borderRadius: INDICATOR_HEIGHT / 2,
                }}
              />
            </MaskedView>
          </Animated.View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    zIndex: 100,
  },
});

export default ProfileTabBar;
