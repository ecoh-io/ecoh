import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import ProfileHeader from '@/src/components/Header/ProfileHeader';
import ProfileTabBar from '@/app/components/ProfileTabBar';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import Screen from '@/src/UI/Screen';
import { Tabs } from 'react-native-collapsible-tab-view';
import PostsScreen from './posts';
import MediaScreen from './media';
import TagsScreen from './tags';
import SavedScreen from './saved';
import { useRouter } from 'expo-router';

const MemoizedProfileHeader = memo(ProfileHeader);
const MemoizedProfileTabBar = memo(ProfileTabBar);

interface User {
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
}

const ProfileInfo = memo(({ user, colors }: { user: User; colors: any }) => (
  <View style={styles.profileInfo}>
    <View style={styles.userInfo}>
      <Image
        source={{
          uri: user?.profileImage || 'https://via.placeholder.com/100',
        }}
        style={styles.profileImage}
        accessibilityLabel="Profile picture"
      />
      <View style={styles.followInfo}>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {user?.connectionsCount || '0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Connections
          </Text>
        </View>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {user?.followersCount || '0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Followers
          </Text>
        </View>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {user?.followingCount || '0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Following
          </Text>
        </View>
      </View>
    </View>
  </View>
));

const ProfileDescription = memo(
  ({ user, colors }: { user: User; colors: any }) => (
    <View style={styles.profileDescription}>
      <Text style={[styles.profileName, { color: colors.text }]}>
        {user?.displayName || ''}
      </Text>
      {user.bio ? (
        <Text style={[styles.profileBio, { color: colors.text }]}>
          {user.bio}
        </Text>
      ) : null}
    </View>
  ),
);

const ProfileLayout: React.FC = () => {
  const { colors, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [headerLayoutHeight, setHeaderLayoutHeight] = useState(250);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tabBarWidth, setTabBarWidth] = useState(
    Dimensions.get('window').width,
  );
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
        <MemoizedProfileHeader
          colors={colors}
          username={user?.username || ''}
          onEditPress={() => router.push('/(app)/edit-profile')}
        />
        {user && <ProfileInfo user={user} colors={colors} />}
        {user && <ProfileDescription user={user} colors={colors} />}
      </View>
    ),
    [colors, user, onHeaderLayout, router],
  );

  const handleTabBarLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTabBarWidth(width);
  }, []);

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
          <View onLayout={handleTabBarLayout}>
            <MemoizedProfileTabBar
              currentIndex={currentIndex}
              onTabPress={handleTabPress}
              tabBarWidth={tabBarWidth}
            />
          </View>
        )}
        onIndexChange={handleIndexChange}
        headerContainerStyle={styles.headerContainer}
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
  profileInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  profileDescription: {
    paddingHorizontal: 10,
  },
  followCount: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  profileName: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
    marginTop: 8,
  },
  profileBio: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.regular,
    marginVertical: 8,
  },
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  followLabel: {
    fontFamily: typography.fontFamilies.poppins.regular,
    fontSize: typography.fontSizes.caption,
  },
  followNumber: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
    marginTop: 5,
  },
  itemContainer: {
    padding: 16,
  },
  itemText: {
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
});

export default memo(ProfileLayout);
