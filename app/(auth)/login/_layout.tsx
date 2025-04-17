import HeaderWithBack from '@/src/components/layout/HeaderWithBack';
import { router, Stack } from 'expo-router';

export default function Layout() {
  return (
    <>
      <HeaderWithBack title="Sign in" onBackPress={router.back} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}
