import RegistrationHeader from '@/src/components/organisms/RegistrationHeader';
import { RegistrationProvider } from '@/src/context/RegistrationContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  const { colors } = useTheme();
  return (
    <RegistrationProvider>
      <SafeAreaView
        edges={['top', 'bottom']}
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </RegistrationProvider>
  );
}
