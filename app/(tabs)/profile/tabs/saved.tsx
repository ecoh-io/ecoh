import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

const SavedScreen: React.FC = () => {
  const { colors } = useTheme();

  useEffect(() => {
    console.log('SavedScreen Mounted');
    return () => console.log('SavedScreen Unmounted');
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        Saved content goes here.
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

export default SavedScreen;
