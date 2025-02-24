import { useTheme } from '@/src/theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text>Home Details Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default DashboardScreen;
