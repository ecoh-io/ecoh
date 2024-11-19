import RegistrationHeader from '@/src/components/atoms/header';
import { RegistrationProvider } from '@/src/context/RegistrationContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <RegistrationProvider>
      <RegistrationHeader />
      <Stack
        initialRouteName="name"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="name" />
        <Stack.Screen name="username" />
        <Stack.Screen name="date-of-birth" />
        <Stack.Screen name="password" />
        <Stack.Screen name="identifier" />
        <Stack.Screen name="one-time-password" />
      </Stack>
    </RegistrationProvider>
  );
}
