import { Stack } from 'expo-router';
import { UnauthenticatedRoute } from '../components/UnauthenticatedRoute';

export default function Layout() {
  return (
    <UnauthenticatedRoute>
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
    </UnauthenticatedRoute>
  );
}
