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
        <Stack.Screen name="edit" />
        <Stack.Screen name="album" />
      </Stack>
    </ProtectedRoute>
  );
}
