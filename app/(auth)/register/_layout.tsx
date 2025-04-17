import RegistrationHeader from '@/src/components/organisms/RegistrationHeader';
import { RegistrationProvider } from '@/src/context/RegistrationContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <RegistrationProvider>
      <RegistrationHeader />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="security" />
        <Stack.Screen name="one-time-passcode" />
      </Stack>
    </RegistrationProvider>
  );
}
