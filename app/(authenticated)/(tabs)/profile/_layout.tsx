import React, { useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ScrollContext } from '@/src/context/ScrollContext';
import ProfileHeader from '@/src/components/Header/ProfileHeader';
import ProfileTabBar from '@/app/components/ProfileTabBar';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { Slot } from 'expo-router';
import Screen from '@/src/UI/Screen';

const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60; // Adjust based on your ProfileTabBar height
const CONTENT_PADDING_TOP = HEADER_HEIGHT + 10; // Adjust for spacing

const ProfileScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const { setTabBarVisible } = useContext(ScrollContext);

  const handleEditProfile = useCallback(() => {
    // Implement your profile editing navigation here
    console.log('Edit Profile Pressed');
  }, []);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    // Example: Hide tab bar when scrolling down beyond 100
    if (currentOffset > 100) {
      setTabBarVisible(false);
    } else {
      setTabBarVisible(true);
    }
  };

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
      {/* Profile Content */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + 20, // Extra padding to prevent content hiding behind tab bar
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        stickyHeaderIndices={[0, 3]}
      >
        <ProfileHeader
          colors={colors}
          username={user?.username || ''}
          onEditPress={handleEditProfile}
        />
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: 'https://via.placeholder.com/100',
              }}
              style={styles.profileImage}
              accessibilityLabel="Profile picture"
            />

            <View style={styles.followInfo}>
              <View style={styles.followCount}>
                <Text style={[styles.followLabel, { color: colors.text }]}>
                  Connections
                </Text>
                <Text style={[styles.followNumber, { color: colors.text }]}>
                  250
                </Text>
              </View>
              <View style={styles.followCount}>
                <Text style={[styles.followLabel, { color: colors.text }]}>
                  Followers
                </Text>
                <Text style={[styles.followNumber, { color: colors.text }]}>
                  1.2k
                </Text>
              </View>
              <View style={styles.followCount}>
                <Text style={[styles.followLabel, { color: colors.text }]}>
                  Following
                </Text>
                <Text style={[styles.followNumber, { color: colors.text }]}>
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

        {/* Custom Profile Tab Bar */}
        <ProfileTabBar />

        <View style={styles.contentContainer}>
          <Slot />
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
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  profileDescription: {
    paddingHorizontal: 10,
  },
  followCount: {
    fontSize: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
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
    marginLeft: 20, // Adjust based on your layout
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
});

export default ProfileScreen;
