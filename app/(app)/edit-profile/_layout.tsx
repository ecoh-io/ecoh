import { useTheme } from '@/src/theme/ThemeContext';
import Screen from '@/src/UI/Screen';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function EditLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Screen
      preset="auto"
      safeAreaEdges={['top', 'bottom']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.screenContent}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="name" />
        <Stack.Screen name="username" />
        <Stack.Screen name="bio" />
        <Stack.Screen name="gender" />
        <Stack.Screen name="location" />
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
