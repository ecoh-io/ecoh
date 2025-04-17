import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { BadgeProps } from './types';

const RelationshipBadge = React.memo(({ type }: BadgeProps) => {
  const badgeText = type === 'connection' ? 'Connection' : 'Following';

  const containerStyle: ViewStyle = {
    ...styles.badgeContainer,
    ...(type === 'following' && {
      backgroundColor: '#e6f0ff',
    }),
  };

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
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle} accessible accessibilityLabel={badgeText}>
        {badgeText}
      </Text>
    </View>
  );
});

export default RelationshipBadge;
