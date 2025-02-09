import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/AuthStore';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    // Show a loading indicator while checking authentication
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    // Redirect to authenticated area
    return <Redirect href="/(app)/(tabs)/dashboard" />;
  } else {
    // Redirect to login
    return <Redirect href="/(auth)" />;
  }
}
