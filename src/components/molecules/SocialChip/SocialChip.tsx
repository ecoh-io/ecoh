import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { SOCIAL_PLATFORM_STYLES } from '@/src/constants/socialPlatformStyles';
import { SocialChipProps } from './types';
import { styles } from './styles';

const SocialChip: React.FC<SocialChipProps> = ({ platform }) => {
  const styleSettings = SOCIAL_PLATFORM_STYLES[platform.key];

  const gradientColors =
    styleSettings.gradient.length >= 2
      ? styleSettings.gradient
      : [styleSettings.gradient[0], styleSettings.gradient[0]];

  const locations = gradientColors.map(
    (_, index) => index / (gradientColors.length - 1),
  );

  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      locations={locations as [number, number, ...number[]]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <FontAwesome6
          name={platform.icon}
          size={18}
          color={styleSettings.text}
          style={styles.icon}
        />
        <Text style={[styles.label, { color: styleSettings.text }]}>
          {platform.name}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SocialChip;
