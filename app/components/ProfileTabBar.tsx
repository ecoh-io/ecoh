import React, { useRef, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter, usePathname } from 'expo-router';

type Tab = {
  name: string;
  path: Href;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconOutline: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const TABS: Tab[] = [
  {
    name: 'Posts',
    path: '/profile/posts',
    icon: 'post-outline',
    iconOutline: 'post-outline',
  },
  {
    name: 'Media',
    path: '/profile/images',
    icon: 'image-multiple-outline',
    iconOutline: 'image-multiple-outline',
  },
  {
    name: 'Tags',
    path: '/profile/tags',
    icon: 'tag-outline',
    iconOutline: 'tag-outline',
  },
  {
    name: 'Saved',
    path: '/profile/saved',
    icon: 'bookmark-outline',
    iconOutline: 'bookmark-outline',
  },
];

const INDICATOR_HEIGHT = 3;

const ProfileTabBar: React.FC = React.memo(() => {
  const router = useRouter();
  const currentPath = usePathname();

  const [tabBarWidth, setTabBarWidth] = useState<number>(0);

  // Use useMemo to ensure tabWidth and indicatorWidth are updated when tabBarWidth changes
  const tabWidth = useMemo(() => tabBarWidth / TABS.length, [tabBarWidth]);
  const indicatorWidth = useMemo(() => tabWidth * 0.5, [tabWidth]);

  const activeTab = useMemo(() => {
    const matchedTab = TABS.find((tab) => tab.path === currentPath);
    return matchedTab ? matchedTab.name : TABS[0].name;
  }, [currentPath]);

  const indicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (tabWidth > 0 && indicatorWidth > 0) {
      const index = TABS.findIndex((tab) => tab.name === activeTab);
      if (index !== -1) {
        const toValue = index * tabWidth + (tabWidth - indicatorWidth) / 2;
        Animated.timing(indicatorPosition, {
          toValue,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }
  }, [activeTab, tabWidth, indicatorWidth]);

  const onTabPress = (tabPath: Href) => {
    if (tabPath !== currentPath) {
      router.replace(tabPath);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      <View
        style={styles.tabBar}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setTabBarWidth(width);
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <Pressable
              key={tab.name}
              style={[styles.tabItem, { width: tabWidth }]}
              onPress={() => onTabPress(tab.path)}
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
});

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
