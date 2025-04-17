import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { usePasswordStrength } from './usePasswordStrength';
import { styles } from './styles';
import { PasswordStrengthProps } from './types';

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { colors } = useTheme();
  const { level, score } = usePasswordStrength(password);

  const segmentColorMap = {
    'Too Weak': colors.secondary,
    Weak: colors.error,
    Medium: colors.warning,
    Strong: colors.success,
    'Very Strong': colors.primary,
  };

  const renderSegments = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.segment,
          {
            backgroundColor:
              i < score ? segmentColorMap[level] : colors.secondary,
            opacity: i < score ? 1 : 0.4,
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>{renderSegments()}</View>
      <Text
        style={[
          styles.label,
          { color: password ? segmentColorMap[level] : colors.secondary },
        ]}
      >
        {password ? level : 'Password strength'}
      </Text>
    </View>
  );
};

export default PasswordStrength;
