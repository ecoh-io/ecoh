import { useTheme } from '@/src/theme/ThemeContext';
import Screen from '@/src/UI/Screen';
import { Stack } from 'expo-router';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="(tabs)"
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </ProtectedRoute>
  );
}
