import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

const TagsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        Tagged content goes here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: typography.Poppins.regular,
  },
});

export default TagsScreen;
