import { typography } from '@/src/theme/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

const HEADER_HEIGHT = 60;

interface HeaderProps {
  username: string;
  onEditPress: () => void;
  colors: any;
  headerOpacity: Animated.Value;
  headerTranslateY: Animated.Value;
}

const ProfileHeader: React.FC<HeaderProps> = memo(
  ({ username, onEditPress, colors, headerOpacity, headerTranslateY }) => {
    return (
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{username}</Text>
        <TouchableOpacity
          accessibilityLabel="Edit Profile"
          accessibilityHint="Navigates to profile editing screen"
          onPress={onEditPress}
          style={styles.headerIcon}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={'#000'}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    position: 'absolute', // Fixed at the top
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000, // Ensure the header is above other content
  },
  title: {
    fontFamily: typography.Poppins.medium,
    fontSize: 22,
  },
  headerIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)', // Light background for better touch area
  },
});

export default memo(ProfileHeader);
