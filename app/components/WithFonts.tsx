import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { fonts } from '@/src/theme/typography';

SplashScreen.preventAutoHideAsync();

interface WithFontsProps {
  children: React.ReactNode;
}

export function WithFonts({ children }: WithFontsProps) {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn('Error hiding splash screen:', error);
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Keep the splash screen visible
  }

  return <>{children}</>;
}
