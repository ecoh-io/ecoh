import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { UsernameAvailabilityIndicatorProps } from './types';

const UsernameAvailabilityIndicator: React.FC<
  UsernameAvailabilityIndicatorProps
> = ({ isChecking, isAvailable, error, value }) => {
  const { colors } = useTheme();

  if (error) {
    return (
      <View style={styles.container}>
        <AntDesign
          name="exclamation"
          size={24}
          color={colors.error}
          style={styles.icon}
        />
      </View>
    );
  }

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" style={styles.icon} />
      </View>
    );
  }

  if (isAvailable && !error && value && value.length > 0) {
    return (
      <View style={styles.container}>
        <Ionicons
          name="checkmark-circle-outline"
          size={24}
          color={colors.success}
          style={styles.icon}
        />
      </View>
    );
  }

  return null;
};

export default UsernameAvailabilityIndicator;
