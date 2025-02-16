import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { typography } from '@/src/theme/typography';
import { SocialPlatform } from '@/src/constants/SocialPlatforms';
import { SOCIAL_PLATFORM_STYLES } from '@/src/constants/socialPlatformStyles';

interface SocialChipProps {
  platform: SocialPlatform;
}

const SocialChip: React.FC<SocialChipProps> = ({ platform }) => {
  const styleSettings = SOCIAL_PLATFORM_STYLES[platform.key];

  // Ensure we have at least 2 colors in the gradient to prevent errors
  const gradientColors =
    styleSettings.gradient.length >= 2
      ? styleSettings.gradient
      : [styleSettings.gradient[0], styleSettings.gradient[0]]; // Duplicate single color if needed

  // Generate a locations array that matches the length of gradientColors
  const locations = gradientColors.map(
    (_, index) => index / (gradientColors.length - 1),
  );

  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      locations={locations as [number, number, ...number[]]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.chipContainer}
    >
      <View style={styles.contentContainer}>
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

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.button,
  },
});
