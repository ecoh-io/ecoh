import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from 'react-native';
import { ScrollContext } from '@/src/context/ScrollContext';
import ProfileHeader from '@/src/components/Header/ProfileHeader';
import ProfileTabBar from '@/app/components/ProfileTabBar';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import Screen from '@/src/UI/Screen';
import { useNavigation } from '@react-navigation/native';
import { SceneMap, TabView } from 'react-native-tab-view';

import PostsScreen from './tabs/posts';
import ImageScreen from './tabs/images';
import TagsScreen from './tabs/tags';
import SavedScreen from './tabs/saved';

const MemoizedProfileHeader = memo(ProfileHeader);
const MemoizedProfileTabBar = memo(ProfileTabBar);

const initialLayout = { width: Dimensions.get('window').width };

interface User {
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
}

const ProfileInfo = memo(
  ({ user, colors }: { user: User | null; colors: any }) => (
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
  ),
);

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
  const { setTabBarVisible } = useContext(ScrollContext);
  const navigation = useNavigation();
  const lastVisibilityRef = useRef<boolean>(true);

  const handleEditProfile = useCallback(() => {
    // Implement edit profile navigation or functionality here
    // Example:
    // navigation.navigate('EditProfile');
  }, [navigation]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const isVisible = currentOffset <= 100;
      if (isVisible !== lastVisibilityRef.current) {
        setTabBarVisible(isVisible);
        lastVisibilityRef.current = isVisible;
      }
    },
    [setTabBarVisible],
  );

  // State for TabView
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'images', title: 'Images' },
    { key: 'tags', title: 'Tags' },
    { key: 'saved', title: 'Saved' },
  ]);

  // Define scenes for each tab
  const renderScene = SceneMap({
    posts: PostsScreen,
    images: ImageScreen,
    tags: TagsScreen,
    saved: SavedScreen,
  });

  const [tabBarWidth, setTabBarWidth] = useState<number>(
    Dimensions.get('window').width,
  );

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      backgroundColor={colors.background}
      contentContainerStyle={{
        flex: 1,
      }}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        stickyHeaderIndices={[3]} // Adjust based on component positions
      >
        {/* Header */}
        <MemoizedProfileHeader
          colors={colors}
          username={user?.username || ''}
          onEditPress={handleEditProfile}
        />

        {/* Profile Info */}
        <ProfileInfo user={user} colors={colors} />

        {/* Profile Description */}
        <ProfileDescription user={user} colors={colors} />

        {/* Tabs */}
        <View style={{ flex: 1 }}>
          <TabView
            navigationState={{ index: tabIndex, routes }}
            renderScene={renderScene}
            onIndexChange={setTabIndex}
            initialLayout={initialLayout}
            renderTabBar={() => (
              <View
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setTabBarWidth(width);
                }}
              >
                <ProfileTabBar
                  currentIndex={tabIndex}
                  onTabPress={setTabIndex}
                  tabBarWidth={tabBarWidth}
                />
              </View>
            )}
            lazy
            swipeEnabled
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  tabNavigator: {
    flex: 1,
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
    fontSize: 21,
    fontFamily: typography.Poppins.medium,
  },
  profileBio: {
    fontSize: 14,
    marginVertical: 8,
    fontFamily: typography.Poppins.regular,
  },
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  followLabel: {
    fontFamily: typography.Poppins.regular,
    fontSize: 14,
  },
  followNumber: {
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
    marginTop: 5,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postImage: {
    width: '33.33%',
    aspectRatio: 1,
  },
  connectionsList: {
    flex: 1,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  connectionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  connectionName: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ProfileLayout;
