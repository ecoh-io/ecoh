import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/AuthStore';
import { ActivityIndicator, View } from 'react-native';

interface UnauthenticatedRouteProps {
  children: React.ReactNode;
}

export const UnauthenticatedRoute = ({
  children,
}: UnauthenticatedRouteProps) => {
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
    // Redirect authenticated users to the authenticated area
    return <Redirect href="/(tabs)/feed" />;
  }

  return <>{children}</>;
};

export default UnauthenticatedRoute;
