import Screen from '@/src/UI/Screen';
import { useTheme } from '@/src/theme/ThemeContext';
import { Stack } from 'expo-router';
import { UnauthenticatedRoute } from '../components/UnauthenticatedRoute';

export default function Layout() {
  const { colors, isDark } = useTheme();
  return (
    <UnauthenticatedRoute>
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
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </Screen>
    </UnauthenticatedRoute>
  );
}
