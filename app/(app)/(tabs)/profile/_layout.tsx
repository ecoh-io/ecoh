import React, { memo, useCallback, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import ProfileHeader from '@/src/components/Header/ProfileHeader';
import ProfileTabBar from '@/app/components/ProfileTabBar';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import Screen from '@/src/UI/Screen';
import { Tabs } from 'react-native-collapsible-tab-view';
import PostsScreen from './posts';
import MediaScreen from './media';
import TagsScreen from './tags';
import SavedScreen from './saved';
import { useRouter } from 'expo-router';
import ProfileInfo from '@/src/components/Profile/ProfileInfo';
import ProfileDescription from '@/src/components/Profile/ProfileDescription';

const ProfileLayout: React.FC = () => {
  const { colors, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [headerLayoutHeight, setHeaderLayoutHeight] = useState(250);
  const [currentIndex, setCurrentIndex] = useState(0);
  const tabNames = ['Posts', 'Media', 'Tags', 'Saved'];
  const tabsRef = useRef<any>(null);
  const router = useRouter();

  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeaderLayoutHeight(height);
  }, []);

  const Header = useCallback(
    () => (
      <View onLayout={onHeaderLayout}>
        <ProfileHeader
          colors={colors}
          username={user?.username || ''}
          onEditPress={() => router.push('/(app)/edit')}
        />
        {user && <ProfileInfo user={user} colors={colors} />}
        {user && <ProfileDescription user={user} colors={colors} />}
      </View>
    ),
    [colors, user, onHeaderLayout, router],
  );

  const handleTabPress = useCallback(
    (index: number) => {
      if (tabsRef.current) {
        const tabName = tabNames[index];
        tabsRef.current.jumpToTab(tabName);
      }
    },
    [tabNames],
  );

  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={['top', 'bottom']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.container}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <Tabs.Container
        ref={tabsRef}
        headerHeight={headerLayoutHeight}
        renderHeader={Header}
        renderTabBar={() => (
          <ProfileTabBar
            currentIndex={currentIndex}
            onTabPress={handleTabPress}
          />
        )}
        onIndexChange={handleIndexChange}
        headerContainerStyle={[
          styles.headerContainer,
          { backgroundColor: colors.background },
        ]}
        initialTabName="Posts"
      >
        <Tabs.Tab name="Posts">
          <PostsScreen />
        </Tabs.Tab>
        <Tabs.Tab name="Media">
          <MediaScreen />
        </Tabs.Tab>
        <Tabs.Tab name="Tags">
          <TagsScreen />
        </Tabs.Tab>
        <Tabs.Tab name="Saved">
          <SavedScreen />
        </Tabs.Tab>
      </Tabs.Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    elevation: 0, // Removes shadow on Android
    shadowOpacity: 0, // Removes shadow on iOS
  },
});

export default memo(ProfileLayout);
