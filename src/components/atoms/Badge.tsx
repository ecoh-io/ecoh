import React from 'react';
import { Text, ViewStyle, TextStyle, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '@/src/theme/typography';

interface BadgeProps {
  type: 'connection' | 'following';
}

const Badge: React.FC<BadgeProps> = React.memo(({ type }) => {
  const badgeText = type === 'connection' ? 'Connection' : 'Following';

  // Common badge container style for padding and border radius.
  const containerStyle: ViewStyle = {
    ...styles.badgeContainer,
    ...(type === 'following' && {
      backgroundColor: '#e6f0ff',
    }),
  };

  // Badge specific styles
  const textStyle: TextStyle = {
    ...styles.badgeText,
    ...(type === 'following' && {
      color: '#0072ff',
    }),
  };

  if (type === 'connection') {
    return (
      <LinearGradient
        colors={['#00c6ff', '#0072ff']}
        style={containerStyle}
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
      <View style={containerStyle}>
        <Text style={textStyle} accessible accessibilityLabel={badgeText}>
          {badgeText}
        </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.poppins.medium,
    color: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 16,
  },
});

export default Badge;
