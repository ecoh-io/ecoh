import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  FlatList,
} from 'react-native';
import { ScrollContext } from '@/src/context/ScrollContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { throttle } from 'lodash';
import { useAuthStore } from '@/src/store/AuthStore';
import ProfileHeader from '@/src/components/Header/ProfileHeader';
import ProfileTabBar from '@/app/components/ProfileTabBar';

const HEADER_HEIGHT = 60;
const SCROLL_THRESHOLD = 20; // Increased threshold to require more significant scroll
const ANIMATION_DURATION = 200;
const TAB_BAR_HEIGHT = 90;
const CONTENT_PADDING_TOP = HEADER_HEIGHT + 10; // Increased padding for better spacing

const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { setTabBarVisible } = useContext(ScrollContext);
  const user = useAuthStore((state) => state.user);

  // State to manage active tab
  const [activeTab, setActiveTab] = useState('Posts');

  // Animated values for header
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  // Refs to track previous scroll and state
  const prevScrollY = useRef(0);
  const headerVisible = useRef(true);
  const isAnimating = useRef(false); // Flag to prevent overlapping animations

  const animateHeader = useCallback(
    (toValueOpacity: number, toValueTranslateY: number, visible: boolean) => {
      if (isAnimating.current) return; // Prevent starting a new animation if one is in progress

      isAnimating.current = true; // Set the animation flag

      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: toValueOpacity,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: toValueTranslateY,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        headerVisible.current = visible;
        setTabBarVisible(visible);
        isAnimating.current = false; // Reset the animation flag
      });
    },
    [headerOpacity, headerTranslateY, setTabBarVisible],
  );

  // Throttled scroll handler accepting currentScrollY as a primitive value
  const throttledHandleScroll = useCallback(
    throttle((currentScrollY: number) => {
      const deltaY = currentScrollY - prevScrollY.current;

      if (deltaY > SCROLL_THRESHOLD && headerVisible.current) {
        // User scrolled down significantly - hide header and tab bar
        animateHeader(0, -HEADER_HEIGHT, false);
      } else if (deltaY < -SCROLL_THRESHOLD && !headerVisible.current) {
        // User scrolled up significantly - show header and tab bar
        animateHeader(1, 0, true);
      }

      prevScrollY.current = currentScrollY;
    }, 100), // Throttled to execute once every 100ms
    [animateHeader],
  );

  // Updated handleScroll to extract currentScrollY synchronously
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      throttledHandleScroll(currentScrollY);
    },
    [throttledHandleScroll],
  );

  const handleEditProfile = useCallback(() => {
    // Implement your profile editing navigation here
    console.log('Edit Profile Pressed');
  }, []);

  // Sample data for demonstration
  const postsData = [
    // Add your posts data here
    { id: '1', content: 'Post 1 content' },
    { id: '2', content: 'Post 2 content' },
    // ... more posts
  ];

  const imagesData = [
    // Add your images data here
    { id: '1', imageUrl: 'https://via.placeholder.com/150' },
    { id: '2', imageUrl: 'https://via.placeholder.com/150' },
    // ... more images
  ];

  const likesData = [
    // Add your likes data here
    { id: '1', content: 'Liked Post 1' },
    { id: '2', content: 'Liked Post 2' },
    // ... more likes
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Posts':
        return (
          <FlatList
            data={postsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.postItem,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.postText, { color: colors.text }]}>
                  {item.content}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.postsList}
            scrollEnabled={false} // Disable internal scrolling to allow parent ScrollView to handle it
          />
        );
      case 'Images':
        return (
          <FlatList
            data={imagesData}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <Image source={{ uri: item.imageUrl }} style={styles.imageItem} />
            )}
            contentContainerStyle={styles.imagesList}
            scrollEnabled={false}
          />
        );
      case 'Likes':
        return (
          <FlatList
            data={likesData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.likeItem,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.likeText, { color: colors.text }]}>
                  {item.content}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.likesList}
            scrollEnabled={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfileHeader
        colors={colors}
        headerOpacity={headerOpacity}
        headerTranslateY={headerTranslateY}
        username={user?.username || ''}
        onEditPress={handleEditProfile}
      />
      {/* Profile Info */}
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: CONTENT_PADDING_TOP,
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.userInfo}>
            <View style={styles.shadow}>
              <Image
                source={{
                  uri: 'https://via.placeholder.com/100',
                }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.followInfo}>
              <View style={styles.followCount}>
                <Text style={[styles.followText, { color: colors.text }]}>
                  Connections
                </Text>
                <Text style={[styles.boldText, { color: colors.text }]}>
                  250
                </Text>
              </View>
              <View style={styles.followCount}>
                <Text style={[styles.followText, { color: colors.text }]}>
                  Followers
                </Text>
                <Text style={[styles.boldText, { color: colors.text }]}>
                  1.2k
                </Text>
              </View>
              <View style={styles.followCount}>
                <Text style={[styles.followText, { color: colors.text }]}>
                  Following
                </Text>
                <Text style={[styles.boldText, { color: colors.text }]}>
                  250
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Description */}
        <View style={styles.profileDescription}>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.displayName || 'Jane Doe'}
          </Text>
          <Text style={[styles.profileUsername, { color: colors.highlight }]}>
            @{user?.username || 'janedoe'}
          </Text>
          <Text style={[styles.profileBio, { color: colors.text }]}>
            {
              'This is a short bio about the user. Passionate about technology and design.'
            }
          </Text>
        </View>

        {/* Tab Bar */}
        <ProfileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Based on Active Tab */}
        <View style={styles.contentContainer}>{renderContent()}</View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  shadow: {
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 6 }, // Downward shadow for depth
    shadowOpacity: 0.3,
    shadowRadius: 4, // Soft spread for shadow
    elevation: 8, // Android shadow effect
    overflow: 'visible',
  },
  profileDescription: {
    paddingHorizontal: 10,
  },
  profileName: {
    fontSize: 24,
    fontFamily: typography.Poppins.medium,
  },
  profileUsername: {
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
  },
  profileBio: {
    fontSize: 14,
    marginVertical: 8,
    fontFamily: typography.Poppins.regular,
  },
  followInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  followText: {
    fontFamily: typography.Poppins.regular,
    fontSize: 14,
  },
  followCount: {
    fontSize: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  boldText: {
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Add subtle shadow
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Add elevation for Android
  },
  buttonText: {
    fontFamily: typography.Poppins.medium,
    fontSize: 16,
  },
  postsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.Poppins.medium,
    marginBottom: 10,
  },
  postsList: {
    gap: 15,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  postItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    // backgroundColor is set dynamically
  },
  postText: {
    fontSize: 16,
    fontFamily: typography.Poppins.regular,
  },
  imagesList: {
    gap: 10,
  },
  imageItem: {
    width: '30%',
    height: 100,
    margin: '1.5%',
    borderRadius: 10,
  },
  likeItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    // backgroundColor is set dynamically
  },
  likeText: {
    fontSize: 16,
    fontFamily: typography.Poppins.regular,
  },
  likesList: {
    gap: 15,
  },
});

export default ProfileScreen;
