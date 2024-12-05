import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import Button from '@/src/UI/Button/Button';

const Index: React.FC = () => {
  const { colors, toggleTheme } = useTheme();

  const registerPressed = () => {
    router.push('/(auth)/register');
  };

  const loginPressed = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Button
        title="Sign in"
        onPress={loginPressed}
        variant="primary"
        gradientColors={['#00c6ff', '#0072ff']}
        size="large"
        style={{ marginBottom: 16 }}
      />
      <Button
        title="Create account"
        onPress={registerPressed}
        variant="secondary"
        size="large"
        style={{ marginBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default Index;
