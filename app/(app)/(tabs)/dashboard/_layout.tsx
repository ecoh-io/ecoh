import Screen from '@/src/components/layout/Screen';
import { useTheme } from '@/src/theme/ThemeContext';
import { Stack } from 'expo-router';

export default function DashboardStack() {
  const { colors, isDark } = useTheme();
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      backgroundColor={colors.background}
      contentContainerStyle={{
        flex: 1,
      }}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <Stack
        screenOptions={{
          headerShown: false, // Show header to include back button
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </Screen>
  );
}
