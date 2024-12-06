import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

interface UsernameCheckProps {
  isChecking: boolean;
  isAvailable: boolean | null;
  error?: string;
}

const UsernameCheck: React.FC<UsernameCheckProps> = ({
  isChecking,
  isAvailable,
  error,
}) => {
  const renderContent = () => {
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
          <Text style={[styles.text, { color: colors.text }]}>{error}</Text>
        </View>
      );
    }

    if (isChecking) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="small" style={styles.icon} />
          <Text style={[styles.text, { color: colors.text }]}>Checking...</Text>
        </View>
      );
    }

    if (isAvailable) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color={colors.success}
            style={styles.icon}
          />
          <Text style={[styles.text, { color: colors.text }]}>
            Username available
          </Text>
        </View>
      );
    }

    if (isAvailable === null && !isChecking) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.secondary}
            style={styles.icon}
          />
          <Text style={[styles.text, { color: colors.text }]}>
            Users can find you with your username
          </Text>
        </View>
      );
    }
  };

  return <>{renderContent()}</>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontFamily: typography.fontFamilies.poppins.regular,
    fontSize: typography.fontSizes.body,
  },
});

export default UsernameCheck;
