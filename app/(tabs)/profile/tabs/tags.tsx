import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

const TagsScreen: React.FC = () => {
  const { colors } = useTheme();

  useEffect(() => {
    console.log('TagsScreen Mounted');
    return () => console.log('TagsScreen Unmounted');
  }, []);

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
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: typography.Poppins.regular,
  },
});

export default TagsScreen;
