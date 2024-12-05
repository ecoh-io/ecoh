import { Slot } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ThemeProvider } from '@/src/theme/ThemeContext';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/src/utils/queryClient';
import { useAuthStore } from '@/src/store/AuthStore';
import { ActivityIndicator, View } from 'react-native';
import { WithFonts } from './components/WithFonts';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function RootLayout() {
  const loading = useAuthStore((state) => state.loading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) {
    // Show a loading indicator or keep the splash screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootSiblingParent>
        <QueryClientProvider client={queryClient}>
          <WithFonts>
            <Slot />
          </WithFonts>
        </QueryClientProvider>
      </RootSiblingParent>
    </ThemeProvider>
  );
}
