import { AuthLayout } from '@/src/components/layout/AuthLayout';
import RegistrationHeader from '@/src/components/organisms/RegistrationHeader';
import { RegistrationProvider } from '@/src/features/authentication/registration/context/RegistrationContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <RegistrationProvider>
      <AuthLayout>
        <RegistrationHeader />
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="identity" />
          <Stack.Screen name="mobile" />
          <Stack.Screen name="email" />
          <Stack.Screen name="security" />
          <Stack.Screen name="one-time-passcode" />
        </Stack>
      </AuthLayout>
    </RegistrationProvider>
  );
}
