import React from 'react';
import { Text, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from Expo
import { typography } from '@/src/theme/typography';

interface BadgeProps {
  type: 'connection' | 'following';
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const badgeText = type === 'connection' ? 'Connection' : 'Following';

  // Define solid background color for "following"
  const followingColor = 'rgba(29, 155, 240,0.3)';

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
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (type === 'connection') {
    return (
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
            borderRadius: 4,
            color: '#1D9BF0',
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

export default Badge;
