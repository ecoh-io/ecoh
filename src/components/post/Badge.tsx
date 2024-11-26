import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from Expo
import { typography } from '@/src/theme/typography';

interface BadgeProps {
  type: 'connection' | 'following';
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const badgeText = type === 'connection' ? 'Connection' : 'Following';

  // Define solid background color for "following"
  const followingColor = '#1D9BF0';

  // Styles for the badge text
  const textStyle: TextStyle = {
    color: '#fff',
    fontSize: 10,
    fontFamily: typography.Poppins.medium,
  };

  // Styles for the badge container
  const badgeContainer: ViewStyle = {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (type === 'connection') {
    return (
      <View style={styles.neuomorphicContainer}>
        <LinearGradient
          colors={['#00c6ff', '#0072ff']}
          style={badgeContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          accessible
          accessibilityLabel={badgeText}
        >
          <Text style={textStyle}>{badgeText}</Text>
        </LinearGradient>
      </View>
    );
  } else {
    return (
      <Text
        style={[
          textStyle,
          {
            backgroundColor: followingColor,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 32,
          },
        ]}
        accessible
        accessibilityLabel={badgeText}
      >
        {badgeText}
      </Text>
    );
  }
};

const styles = StyleSheet.create({
  neuomorphicContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#888',
    shadowOffset: { width: 0, height: 4 }, // Downward shadow for depth
    shadowOpacity: 0.25,
    shadowRadius: 4, // Soft spread for shadow
    elevation: 8, // Android shadow effect
  },
});

export default Badge;
